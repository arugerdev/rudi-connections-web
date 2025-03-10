"use client";
import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  useEffect(() => {
    (window as any).toast = toast
  }, [])


  return (
    <HeroUIProvider>
      <Toaster
        position='bottom-right'
        gutter={2}
      />
      <NextThemesProvider
        defaultTheme='system'
        attribute='class'
        {...themeProps}>
        {children}
      </NextThemesProvider>

    </HeroUIProvider>
  );
}
