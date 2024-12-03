import "@/styles/globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import { fontSans } from "@/config/fonts";
import clsx from "clsx";
import { Toaster } from "react-hot-toast";


export const metadata: Metadata = {
  title: "Rud1",
  description: "Panel de administración de dispositivos Rud1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang='en'>
      <body className={clsx("font-sans antialiased", fontSans.className)}>
        <Toaster
          position='bottom-right'
          gutter={2}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
