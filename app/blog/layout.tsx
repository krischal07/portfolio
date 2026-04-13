import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Engineering write-ups, build notes, and thoughts from Krischal Shrestha — coming soon.",
  alternates: {
    canonical: "https://krischal.space/blog",
  },
  openGraph: {
    url: "https://krischal.space/blog",
    title: "Blog | Krischal Shrestha",
    description:
      "Engineering write-ups, build notes, and thoughts from Krischal Shrestha — coming soon.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
