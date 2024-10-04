import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/nav-bar";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StanStats | Artist popularity by the numbers",
  description:
    "Compare your favorite artists daily. See who's hot and who's not.",
  icons: {
    icon: [{ url: "/apple-icon.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </head>
      <body className={inter.className}>
        <Providers>
          <NavBar />
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
