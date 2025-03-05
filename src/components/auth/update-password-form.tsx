"use client";

import { useState, FormEvent } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { logger } from "@/lib/logger";

export default function UpdatePasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
    
    // Validation de base
    if (password !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      setIsLoading(false);
      return;
    }
    
    if (password.length < 8) {
      setErrorMessage("Le mot de passe doit contenir au moins 8 caractères.");
      setIsLoading(false);
      return;
    }
    
    try {
      logger.info("Attempting to update password");
      
      const { error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) {
        logger.error("Password update error", { error: error.message });
        setErrorMessage(error.message);
        return;
      }
      
      logger.info("Password updated successfully");
      setSuccessMessage(
        "Votre mot de passe a été mis à jour avec succès. Vous allez être redirigé vers la page de connexion."
      );
      
      // Déconnecter l'utilisateur et rediriger vers la page de connexion après un délai
      setTimeout(async () => {
        await supabase.auth.signOut();
        router.push("/login");
      }, 3000);
    } catch (error) {
      logger.error("Unexpected password update error", { error });
      setErrorMessage("Une erreur inattendue s'est produite. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <div className="text-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Mettre à jour le mot de passe</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Créez un nouveau mot de passe pour votre compte
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
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nouveau mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none dark:border-gray-700 dark:bg-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Confirmer le nouveau mot de passe
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none dark:border-gray-700 dark:bg-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Mise à jour en cours..." : "Mettre à jour le mot de passe"}
          </button>
        </div>
      </form>
    </div>
  );
}
