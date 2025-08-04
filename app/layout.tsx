import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextAuthProvider } from "@/providers/NextAuthProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
import Pilot from "./pilot";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StartupMatch",
  description: "Discover your next startup idea",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Pilot />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextAuthProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">{children}</main>
              {/* <Footer /> */}
            </div>
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
