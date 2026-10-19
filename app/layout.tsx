import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Plus_Jakarta_Sans } from "next/font/google";
import BottomNav from "@/components/BottomNav";
import ScrollTopNav from "@/components/ScrollTopNav";
import "./globals.css";
import "./theme.css";

const display = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-display",
});

const body = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Arifz.cut",
  description: "Ambil nomor antrean dan pantau giliranmu secara langsung.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${display.variable} ${body.variable}`}>
      <body className="antialiased">
        <div className="ambient" aria-hidden="true" />
        <ScrollTopNav />
        {children}
        <BottomNav />
      </body>
    </html>
  );
}