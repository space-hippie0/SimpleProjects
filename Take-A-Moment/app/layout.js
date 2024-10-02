import localFont from "next/font/local";
import "./globals.css";
import { Inter } from "next/font/google"
import Header from "@/components/header";
import {ClerkProvider} from "@clerk/nextjs";


export const metadata = {
  title: "TakeAMoment",
  description: "Everything Scheduling App",
};

const inter = Inter({subsets: ["latin"]});

export default function RootLayout({ children }) {
  return (
      <ClerkProvider>
    <html lang="en">
      <body
        className = {inter.className}>
      {/* Header */}
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-purple-100 to-gray-800">{children}</main>
      {/* Footer */}
      <footer className="bg-black py-12">
          <div className="container mx-auto px-20 text-center text-white">
              <p>a project by zma</p>
          </div>
      </footer>
      </body>
    </html>
      </ClerkProvider>
  );
}
