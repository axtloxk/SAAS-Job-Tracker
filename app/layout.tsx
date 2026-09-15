import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Job/Navbar";

export const metadata: Metadata = {
  title: "Job Application Tracker",
  description: "Track and organize your job search in one place.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="flex min-h-full flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
