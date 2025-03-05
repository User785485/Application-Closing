import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { ThemeProvider } from "../components/theme-provider";
import Navigation from "../components/navigation";
import { SupabaseProvider } from "../lib/supabase-provider";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "My Muqabala 3.0",
  description: "Plateforme de coaching et de développement personnel",
};

// Ajouter un logger côté serveur pour tracer l'initialisation
console.log('RootLayout is being initialized on server-side...');

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Utiliser un useEffect pour logger le cycle de vie côté client
  if (typeof window !== 'undefined') {
    console.log('RootLayout rendering on client-side');
  }
  
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Ajouter un script qui va logger dès que le chargement commence */}
        <script 
          dangerouslySetInnerHTML={{ 
            __html: `console.log('Document starting to load at: ' + new Date().toISOString());` 
          }} 
        />
      </head>
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
        
        {/* Script qui s'exécute une fois que la page est chargée */}
        <script 
          dangerouslySetInnerHTML={{ 
            __html: `
              document.addEventListener('DOMContentLoaded', function() {
                console.log('Document fully loaded at: ' + new Date().toISOString());
              });
            ` 
          }} 
        />
      </body>
    </html>
  );
}
