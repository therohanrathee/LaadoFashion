import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Laado Fashion & Boutique | Bespoke Tailoring at Your Doorstep",
  description: "Premium ladies wear stitching, custom tailoring, and boutique fashion. Book a home measurement today.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
