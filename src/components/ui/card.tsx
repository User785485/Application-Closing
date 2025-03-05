import React from "react";

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ className = "", children }) => {
  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

Card.Header = function CardHeader({
  className = "",
  children,
}: CardHeaderProps) {
  return (
    <div
      className={`px-6 py-4 border-b border-gray-200 dark:border-gray-700 ${className}`}
    >
      {children}
    </div>
  );
};

interface CardBodyProps {
  className?: string;
  children: React.ReactNode;
}

Card.Body = function CardBody({ className = "", children }: CardBodyProps) {
  return <div className={`p-6 ${className}`}>{children}</div>;
};

interface CardFooterProps {
  className?: string;
  children: React.ReactNode;
}

Card.Footer = function CardFooter({
  className = "",
  children,
}: CardFooterProps) {
  return (
    <div
      className={`px-6 py-4 border-t border-gray-200 dark:border-gray-700 ${className}`}
    >
      {children}
    </div>
  );
};
