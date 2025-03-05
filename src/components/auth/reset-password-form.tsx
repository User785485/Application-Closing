"use client";

import { useState, FormEvent } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { logger } from "@/lib/logger";

export default function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    
    try {
      logger.info("Attempting password reset", { email });
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      
      if (error) {
        logger.error("Password reset error", { error: error.message });
        setErrorMessage(error.message);
        return;
      }
      
      logger.info("Password reset email sent successfully", { email });
      setSuccessMessage(
        "Un email de ru00e9initialisation a u00e9tu00e9 envoyu00e9. Veuillez vu00e9rifier votre bou00eete de ru00e9ception et suivre les instructions."
      );
      
      // Rediriger vers la page de connexion apru00e8s un du00e9lai
      setTimeout(() => {
        router.push("/login");
      }, 5000);
    } catch (error) {
      logger.error("Unexpected password reset error", { error });
      setErrorMessage("Une erreur inattendue s'est produite. Veuillez ru00e9essayer.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <div className="text-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Ru00e9initialiser le mot de passe</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Saisissez votre adresse e-mail pour recevoir un lien de ru00e9initialisation
        </p>
      </div>
      
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {errorMessage && (
          <div className="p-4 text-sm text-red-800 bg-red-100 rounded-md dark:bg-red-900/30 dark:text-red-200">
            {errorMessage}
          </div>
        )}
        
        {successMessage && (
          <div className="p-4 text-sm text-green-800 bg-green-100 rounded-md dark:bg-green-900/30 dark:text-green-200">
            {successMessage}
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
          <button
            type="submit"
            disabled={isLoading}
            className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Envoi en cours..." : "Envoyer le lien de ru00e9initialisation"}
          </button>
        </div>
      </form>
      
      <div className="text-center">
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
            Retour u00e0 la connexion
          </a>
        </p>
      </div>
    </div>
  );
}
