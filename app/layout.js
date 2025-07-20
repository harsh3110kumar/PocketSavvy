import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header.jsx";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PocketSavvy - Smart Personal Finance Management",
  description: "Track, manage, and understand your financial activities with PocketSavvy's intelligent finance assistant.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark" suppressHydrationWarning>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
          <meta httpEquiv="Pragma" content="no-cache" />
          <meta httpEquiv="Expires" content="0" />
        </head>
        <body className={inter.className}>
          <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-16">{children}</main>
            <Toaster 
              richColors 
              position="bottom-right"
              duration={4000}
              closeButton={true}
              theme="dark"
            />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
