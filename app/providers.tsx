"use client";
import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { useEffect } from "react";
import { ToastProvider } from "@heroui/react";
import { createClient } from "@/utils/supabase/client";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const [notifications, setNotifications] = React.useState(false);
  useEffect(() => {
    const fetchUserData = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();
      console.log(data.user);
      if (error) {
        console.error("Error al obtener los datos del usuario", error);
      }

      if (data) {
        setNotifications(data.user?.user_metadata?.notifications ?? true);
      }
    };
    fetchUserData();
  }, []);


  return (
    <HeroUIProvider>
      {notifications &&
        <ToastProvider />
      }
      <NextThemesProvider
        defaultTheme='system'
        attribute='class'
        {...themeProps}>
        {children}
      </NextThemesProvider>

    </HeroUIProvider>
  );
}
