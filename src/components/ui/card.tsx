"use client";

import React from "react";

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

interface CardBodyProps {
  className?: string;
  children: React.ReactNode;
}

interface CardFooterProps {
  className?: string;
  children: React.ReactNode;
}

// Définition du composant Header
const CardHeader = ({ className = "", children }: CardHeaderProps) => {
  return (
    <div
      className={`px-6 py-4 border-b border-gray-200 dark:border-gray-700 ${className}`}
    >
      {children}
    </div>
  );
};

// Définition du composant Body
const CardBody = ({ className = "", children }: CardBodyProps) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};

// Définition du composant Footer
const CardFooter = ({ className = "", children }: CardFooterProps) => {
  return (
    <div
      className={`px-6 py-4 border-t border-gray-200 dark:border-gray-700 ${className}`}
    >
      {children}
    </div>
  );
};

// Définition du composant Card principal
const Card = ({ className = "", children }: CardProps) => {
  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
};

// Attacher les sous-composants à Card
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

// Exporter le composant avec tous ses sous-composants
export { Card };
