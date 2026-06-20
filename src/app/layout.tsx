import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/common/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

const serif = Cormorant_Garamond({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: "VivahaSetu | Trusted Matrimony Platform for Indian Communities",
  description: "A trusted matrimony platform for South Indian communities. Find your perfect life partner through verified profiles and meaningful connections.",
  keywords: ["matrimony", "indian matrimony", "wedding", "marriage", "vivahasetu", "shaadi", "billava", "ediga", "namadhari", "lingayat"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${serif.variable} font-inter antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
