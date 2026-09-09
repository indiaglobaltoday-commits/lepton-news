import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BreakingTicker from "@/components/BreakingTicker";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lepton News | ताज़ा खबरें, ब्रेकिंग न्यूज़",
  description: "Lepton News — भारत और दुनिया की ताज़ा खबरें, ब्रेकिंग न्यूज़, विश्लेषण। राजनीति, खेल, तकनीक, वित्त, मनोरंजन सब एक जगह।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7241227459691122"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <BreakingTicker />
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
