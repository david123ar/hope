import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Earn from Your Bio – Instantly Monetize as a Creator | Bio Link",
  description:
    "Creators: Turn your followers into income. Set up your monetized bio page in 60 seconds. No sponsors needed. We provide the ads — you get paid. 100% free.",
  keywords: [
    "bio link for creators",
    "monetize link in bio",
    "earn from followers",
    "creator monetization",
    "free bio link",
    "bio page ads",
    "influencer income",
    "no sponsor earnings",
    "linktree alternative",
  ],
  openGraph: {
    title: "Earn from Your Bio – Instantly Monetize as a Creator | Bio Link",
    description:
      "Join thousands of creators earning from their bio links. Add your links, share your page, and get paid through our built-in ads. No fees, no sponsors.",
    url: "https://yourdomain.com", // Replace with actual domain
    type: "website",
    siteName: "Bio Link",
    images: [
      {
        url: "https://yourdomain.com/og-image.jpg", // Replace with actual image
        width: 1200,
        height: 630,
        alt: "Bio Link – Monetize as a Creator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Earn from Your Bio – Instantly Monetize as a Creator",
    description:
      "Monetize your link in bio. 1 link. Built-in ads. Zero fees. Works for any platform: Instagram, YouTube, TikTok, more.",
    images: ["https://yourdomain.com/og-image.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
