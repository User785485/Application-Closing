// src/components/layout/Footer.tsx

export default function Footer() {
  return (
    <footer className="mt-auto py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} My Muqabala 3.0. Tous droits ru00e9servu00e9s.
          </div>
          <div className="flex space-x-4">
            <a 
              href="/terms" 
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Conditions d'utilisation
            </a>
            <a 
              href="/privacy" 
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Politique de confidentialitu00e9
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
