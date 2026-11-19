import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coy | Discover",
  description: "Anonymous double-blind discovery on Coy. Mutual likes only.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased flex flex-col items-center justify-start">
        {children}
      </body>
    </html>
  );
}
