import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast"; // ✅ import toaster

// Load fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://biolynk.shoko.fun"),
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
    "biolynk",
  ],
  openGraph: {
    title: "Earn from Your Bio – Instantly Monetize as a Creator | Bio Link",
    description:
      "Join thousands of creators earning from their bio links. Add your links, share your page, and get paid through our built-in ads. No fees, no sponsors.",
    url: "https://biolynk.shoko.fun",
    siteName: "BioLynk",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BioLynk – Monetize Your Link",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Earn from Your Bio – Instantly Monetize as a Creator",
    description:
      "Monetize your link in bio. 1 link. Built-in ads. Zero fees. Works for any platform: Instagram, YouTube, TikTok, more.",
    images: ["/og-image.jpg"],
    creator: "@yourTwitterHandle",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} /> {/* ✅ Add toaster */}
        {children}
      </body>
    </html>
  );
}
