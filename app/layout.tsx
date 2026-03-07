import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Duddaloos",
  description: "Pedagogiska posters och material för barn",
  icons: {
    icon: "/logo-domain.png",
    apple: "/logo-domain.png",
  },
  openGraph: {
    title: "Duddaloos",
    description: "Pedagogiska posters och material för barn",
    images: [
      {
        url: "/logo-domain.png",
        width: 1200,
        height: 630,
        alt: "Duddaloos logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
