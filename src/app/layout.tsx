import type { Metadata } from "next";
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
      <body>
        <main className="min-h-screen p-5 flex justify-center">{children}</main>
      </body>
    </html>
  );
}
