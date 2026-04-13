import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://krischal.space"),
  title: {
    default: "Krischal Shrestha — Software Engineer",
    template: "%s | Krischal Shrestha",
  },
  description:
    "Krischal Shrestha is a design-minded software engineer building scalable systems. Founder of Rocket Space, building Samparka and Upasthit.",
  keywords: [
    "Krischal Shrestha",
    "software engineer",
    "full stack developer",
    "Next.js",
    "React",
    "portfolio",
    "Rocket Space",
    "Samparka",
    "Upasthit",
  ],
  authors: [{ name: "Krischal Shrestha", url: "https://krischal.space" }],
  creator: "Krischal Shrestha",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://krischal.space",
    siteName: "Krischal Shrestha",
    title: "Krischal Shrestha — Software Engineer",
    description:
      "Design-minded software engineer building scalable systems. Founder of Rocket Space, building Samparka and Upasthit.",
    images: [
      {
        url: "/profile/pp_light.png",
        width: 800,
        height: 800,
        alt: "Krischal Shrestha",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Krischal Shrestha — Software Engineer",
    description:
      "Design-minded software engineer building scalable systems. Founder of Rocket Space, building Samparka and Upasthit.",
    images: ["/profile/pp_light.png"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Prevent flash of wrong theme on load */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');if(t==='dark')document.documentElement.classList.add('dark')}catch(e){}})()` }} />
      </head>
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
