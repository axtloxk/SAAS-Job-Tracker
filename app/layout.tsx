import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers";
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
    <html
      suppressHydrationWarning
      lang="en"
      data-scroll-behavior="smooth"
      className="h-full antialiased scroll-smooth"
    >
      <body className="flex min-h-full flex-col">
        <Providers>
          {/* <Navbar /> */}
          <main className="flex-1">{children}</main>
          <Toaster
            position="bottom-left"
            duration={2000}
            className="custom-responsive-toaster"
            toastOptions={{
              classNames: {
                success: "bg-green-100! text-green-800! border-green-200!",
                error: "bg-red-100! text-red-800! border-red-200!",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
