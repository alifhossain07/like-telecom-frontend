export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";
import ClientLayoutWrapper from "@/components/layout/ClientLayoutWrapper";
import DynamicPopup from "@/components/layout/DynamicPopup";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface BusinessSetting {
  key: string;
  value: string;
}

async function getBusinessSettings(): Promise<BusinessSetting[] | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/info`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    return data.settings;
  } catch (error) {
    console.error("Error fetching business settings:", error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getBusinessSettings();

  if (!settings) {
    return {
      title: "Like Telecom",
      description: "Best Mobile Shop",
    };
  }

  const websiteName =
    settings.find((s) => s.key === "website_name")?.value ||
    "Like Telecom";
  const metaTitle =
    settings.find((s) => s.key === "meta_title")?.value || websiteName;
  const metaDescription =
    settings.find((s) => s.key === "meta_description")?.value || "";
  const siteIcon =
    settings.find((s) => s.key === "site_icon")?.value;

  return {
    title: {
      default: metaTitle,
      template: `%s | ${websiteName}`,
    },
    description: metaDescription,
    icons: {
      icon: siteIcon || "/favicon.ico",
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body className={`${poppins.variable} antialiased`}>
        <AuthProvider>
          <CartProvider>
            <DynamicPopup />
            <Navbar />
            <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
            <Footer />
            <Toaster
              position="top-right"
              reverseOrder={false}
              toastOptions={{
                duration: 3000,
                style: {
                  fontWeight: 500,
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
