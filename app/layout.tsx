import type { Metadata } from "next";
import Script from "next/script";
import "@/app/globals.css";
import { siteConfig } from "@/lib/site-config";
import { defaultOgImage } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`
  },
  description: siteConfig.description,
  applicationName: siteConfig.title,
  referrer: "origin-when-cross-origin",
  keywords: [
    "ZenUP",
    "NAD+ supplement",
    "nicotinamide riboside",
    "cellular energy support",
    "healthy aging supplement",
    "quercetin phytosome",
    "resveratrol",
    "coq10"
  ],
  authors: [{ name: siteConfig.title, url: siteConfig.url }],
  creator: siteConfig.title,
  publisher: siteConfig.title,
  category: "health",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.title,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [defaultOgImage]
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [defaultOgImage.url]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const googleTagId = siteConfig.googleTagId;

  return (
    <html lang="en">
      <body>
        {googleTagId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${googleTagId}`}
              strategy="afterInteractive"
            />
            <Script id="google-tag-manager" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${googleTagId}');
              `}
            </Script>
          </>
        ) : null}
        {children}
      </body>
    </html>
  );
}
