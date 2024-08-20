import type { Metadata } from "next";
import { Reddit_Mono } from "next/font/google";
const font = Reddit_Mono({ subsets: ["latin"] });
import "./globals.css";

export const metadata: Metadata = {
  title: "univ",
  icons: {
    icon: "/logo-white.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <main className="flex flex-col min-h-screen bg-gray-900 text-white">
          {children}
        </main>
      </body>
    </html>
  );
}
