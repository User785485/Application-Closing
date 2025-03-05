"use client";

import React from "react";
import { uiLogger } from "../../utils/logger";
import { useComponentLogger } from "../../hooks/useComponentLogger";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "danger" | "outline" | "ghost";
  size?: "xs" | "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  className = "",
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  onClick,
  ...props
}) => {
  // Utilisation du hook de surveillance des composants
  const { logEvent } = useComponentLogger({
    componentName: 'Button',
    props: { variant, size, isLoading, fullWidth, disabled },
    validations: [
      {
        prop: 'size',
        validValues: ['xs', 'sm', 'md', 'lg'],
        message: `Invalid button size. Must be one of: xs, sm, md, lg`
      },
      {
        prop: 'variant',
        validValues: ['primary', 'secondary', 'success', 'danger', 'outline', 'ghost'],
        message: `Invalid button variant. Must be one of: primary, secondary, success, danger, outline, ghost`
      }
    ]
  });

  // Log pour débogage et prévention des problèmes futurs
  uiLogger.debug(`Button rendered with variant=${variant}, size=${size}`);

  // Vérification de taille invalide (pour détecter d'éventuelles valeurs invalides futures)
  if (size && !["xs", "sm", "md", "lg"].includes(size)) {
    uiLogger.warn(`Invalid button size: ${size}. Using default size 'md' instead.`);
    size = "md";
  }

  // Vérification de variante invalide
  if (variant && !["primary", "secondary", "success", "danger", "outline", "ghost"].includes(variant)) {
    uiLogger.warn(`Invalid button variant: ${variant}. Using default variant 'primary' instead.`);
    variant = "primary";
  }

  // Gestionnaire de clic avec journalisation
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    logEvent('click');
    if (onClick) onClick(e);
  };

  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500";
      case "secondary":
        return "bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500";
      case "success":
        return "bg-success-600 text-white hover:bg-success-700 focus:ring-success-500";
      case "danger":
        return "bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500";
      case "outline":
        return "bg-transparent border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200";
      case "ghost":
        return "bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200";
      default:
        return "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "xs":
        return "px-2 py-1 text-xs";
      case "sm":
        return "px-3 py-1.5 text-sm";
      case "md":
        return "px-4 py-2 text-base";
      case "lg":
        return "px-6 py-3 text-lg";
      default:
        return "px-4 py-2 text-base";
    }
  };

  return (
    <button
      className={`
        ${getVariantClasses()} 
        ${getSizeClasses()} 
        ${fullWidth ? "w-full" : ""} 
        inline-flex items-center justify-center rounded-md font-medium
        focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors
        disabled:opacity-60 disabled:cursor-not-allowed
        ${className}
      `}
      disabled={disabled || isLoading}
      onClick={handleClick}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};
