import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Build notes from Krischal Shrestha on Markish, social media management, product design, and software engineering.",
  keywords: [
    "Markish",
    "markish.tech",
    "social media management",
    "content planning",
    "Krischal Shrestha blog",
  ],
  alternates: {
    canonical: "https://krischal.space/blog",
  },
  openGraph: {
    url: "https://krischal.space/blog",
    title: "Markish & Product Building | Krischal Shrestha",
    description:
      "Build notes on Markish, social media management, product design, and software engineering.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
