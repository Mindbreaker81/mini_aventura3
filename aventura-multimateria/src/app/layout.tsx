import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "./components/I18nProvider";
import RGPDBanner from "./components/RGPDBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: false, // Solo precargar la fuente principal
});

export const metadata: Metadata = {
  title: "Aventura Multimateria - Juegos Educativos",
  description: "Plataforma educativa con 10 minijuegos interactivos para aprender gramática, matemáticas, geografía, historia, ciencias, reciclaje y programación",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <I18nProvider>
          {children}
        </I18nProvider>
        <RGPDBanner />
      </body>
    </html>
  );
}
