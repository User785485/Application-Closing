"use client";

import { appLogger } from './logger';

// Types for build errors
export type BuildErrorType = {
  component: string;
  file: string;
  message: string;
  stack?: string;
  timestamp: number;
};

// Store of build errors
const buildErrors: BuildErrorType[] = [];

/**
 * Logs a build error and stores it for future reference
 * @param component Component name where the error occurred
 * @param file File path where the error occurred
 * @param message Error message
 * @param stack Error stack trace (optional)
 */
export function logBuildError(component: string, file: string, message: string, stack?: string): void {
  const error: BuildErrorType = {
    component,
    file,
    message,
    stack,
    timestamp: Date.now(),
  };
  
  buildErrors.push(error);
  
  // Format a detailed log message
  const logMessage = `BUILD ERROR [${component}] in ${file}: ${message}\n${stack || 'No stack trace'}`;
  appLogger.error(logMessage);
  
  // Also log to console in development for immediate visibility
  if (process.env.NODE_ENV === 'development') {
    console.error('🔴 BUILD ERROR:', error);
  }
}

/**
 * Validates that a component exists and is correctly imported
 * @param component Component to validate
 * @param componentName Name of the component for logging
 * @param file File path where the component is used
 */
export function validateComponent(component: any, componentName: string, file: string): boolean {
  if (!component) {
    logBuildError(componentName, file, `Component is undefined. Check import statement.`, 
      new Error().stack);
    return false;
  }
  return true;
}

/**
 * Returns all logged build errors
 */
export function getBuildErrors(): BuildErrorType[] {
  return [...buildErrors];
}

/**
 * Clears all stored build errors
 */
export function clearBuildErrors(): void {
  buildErrors.length = 0;
}
