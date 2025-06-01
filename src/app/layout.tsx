
 
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppProvider } from "@/context/AppContext";
import "./globals.css";


// Configure the Inter font with fallback options
const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  fallback: ['system-ui', 'Arial', 'sans-serif']
});

export const metadata: Metadata = {
  title: "Sorting Algorithm Visualizer",
  description: "Visualize and compare different sorting algorithms",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ]
  },
  manifest: '/manifest.json'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background min-h-screen`}>
        <div className="min-h-screen flex flex-col">
          <header className="bg-white shadow-sm py-4">
            <div className="container mx-auto px-4">
              <h1 className="text-2xl font-bold text-center text-primary">
                Sorting Algorithm Visualizer
              </h1>
            </div>
          </header>

          <main className="flex-grow">
            <AppProvider>{children}</AppProvider>
          </main>

          <footer className="bg-white py-4 border-t">
            <div className="container mx-auto px-4">
              <p className="text-center text-sm text-gray-500">
                Sorting Algorithm Visualizer - Built with Next.js and Tailwind CSS
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}


