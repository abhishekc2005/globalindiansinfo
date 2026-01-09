import type { Metadata } from "next";
import Script from "next/script";
import { Poppins, Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/provider/theme-provider";
import { AuthProvider } from "@/provider/session-provider";
import { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import SmoothScroll from "@/components/providers/SmoothScroll";
import { Button } from "@/components/ui/button";
import { getPhoneNumber } from "@/utils/contact.utils";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import MainHeader from "@/components/layout/Header";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Global Indians | Connecting Global Indians Worldwide",
    template: "%s | Global Indians",
  },
  description:
    "Global Indians is the premier platform connecting the Indian diaspora worldwide. Discover inspiring stories, opportunities, and build meaningful connections across the globe.",
  keywords: [
    "Global Indians",
    "Indian Diaspora",
    "NRIs",
    "Indian Community",
    "Global Indian Network",
    "Indian Professionals",
    "Indian Students Abroad",
  ],
  authors: [{ name: "Global Indians Team" }],
  creator: "Global Indians",
  metadataBase: new URL("https://globalindiansinfo.com"), // Setting a base URL for metadata
  icons: {
    icon: "/image.png",
    shortcut: "/image.png",
    apple: "/image.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://globalindiansinfo.com",
    title: "Global Indians | Connecting Global Indians Worldwide",
    description:
      "Global Indians is the premier platform connecting the Indian diaspora worldwide. Discover inspiring stories, opportunities, and build meaningful connections.",
    siteName: "Global Indians",
    images: [
      {
        url: "/image.png",
        width: 1200,
        height: 630,
        alt: "Global Indians",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Global Indians | Connecting Global Indians Worldwide",
    description:
      "Global Indians is the premier platform connecting the Indian diaspora worldwide.",
    images: ["/image.png"],
    creator: "@globalindians",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  auth,
  children,
}: Readonly<{
  auth: ReactNode;

  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${poppins.variable} ${montserrat.variable} ${playfair.variable} antialiased`}
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <MainHeader />
            <SmoothScroll>
              {children}

              <Footer />
            </SmoothScroll>
            <FloatingWhatsApp />
            {auth}
            <Toaster richColors closeButton position="bottom-right" />
          </ThemeProvider>
        </AuthProvider>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </body>
    </html>
  );
}
