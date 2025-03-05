import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { ThemeProvider } from "../components/theme-provider";
import Navigation from "../components/navigation";
import { SupabaseProvider } from "../lib/supabase-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "My Muqabala 3.0",
  description: "Plateforme de coaching et de développement personnel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans min-h-screen`}>
        <SupabaseProvider>
          <ThemeProvider defaultTheme="light" storageKey="theme-preference">
            <div className="flex flex-col min-h-screen">
              <Navigation />
              <main className="flex-grow py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  {children}
                </div>
              </main>
              <footer className="bg-white dark:bg-slate-900 shadow-sm py-4">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    &copy; {new Date().getFullYear()} My Muqabala 3.0. Tous droits réservés.
                  </p>
                </div>
              </footer>
            </div>
          </ThemeProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
