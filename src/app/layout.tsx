import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Qavah | Worship presentation",
  description: "A calm, fast Bible presentation workspace for worship teams.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
