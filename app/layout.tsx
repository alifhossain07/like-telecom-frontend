// app/layout.tsx

import "./globals.css";
import type { Metadata } from "next";

// Import the fonts from next/font/google
import { Montserrat, Open_Sans } from "next/font/google";
import Header from "./Components/Shared/Header";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-opensans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Your E-commerce Project",
  description: "An awesome e-commerce site",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${montserrat.variable} ${openSans.variable} antialiased`}>
      <body className="font-text">
        <Header />
        {children}
      </body>
    </html>
  );
}
