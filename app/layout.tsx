import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coding Challenge Publisher",
  description: "Turn SQL and Python coding challenges into Markdown and publish them to GitHub.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/brand/coding-challenge-publisher.png",
    shortcut: "/brand/coding-challenge-publisher.png",
    apple: "/brand/coding-challenge-publisher.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
