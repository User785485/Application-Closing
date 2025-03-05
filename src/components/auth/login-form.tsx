"use client";

import { useState, FormEvent } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { logger } from "@/lib/logger";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      logger.info("Attempting to sign in user", { email });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        logger.error("Login error", { error: error.message });
        setErrorMessage(error.message);
        return;
      }
      
      if (data?.user) {
        logger.info("User signed in successfully", {
          userId: data.user.id,
          email: data.user.email,
        });
        
        // Get redirect URL from query parameter or go to default dashboard
        const params = new URLSearchParams(window.location.search);
        const redirectUrl = params.get("redirectUrl") || "/dashboard";
        
        router.push(redirectUrl);
        router.refresh(); // Refresh to update auth state globally
      }
    } catch (error) {
      logger.error("Unexpected login error", { error });
      setErrorMessage("Une erreur inattendue s'est produite. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <div className="text-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Connexion</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Accédez à votre compte pour gérer votre pratique
        </p>
      </div>
      
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {errorMessage && (
          <div className="p-4 text-sm text-red-800 bg-red-100 rounded-md dark:bg-red-900/30 dark:text-red-200">
            {errorMessage}
          </div>
        )}
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none dark:border-gray-700 dark:bg-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none dark:border-gray-700 dark:bg-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="remember-me" className="block ml-2 text-sm text-gray-900 dark:text-gray-300">
              Se souvenir de moi
            </label>
          </div>
          
          <div className="text-sm">
            <a href="/reset-password" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
              Mot de passe oublié?
            </a>
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </div>
      </form>
      
      <div className="text-center">
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Vous n&apos;avez pas de compte?{" "}
          <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
            Inscrivez-vous
          </a>
        </p>
      </div>
    </div>
  );
}
