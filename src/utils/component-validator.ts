"use client";

import { logBuildError } from './build-logger';

interface ComponentMetadata {
  name: string;
  isClient: boolean;
  imports: string[];
  file: string;
}

// Store component metadata for analysis
const componentsRegistry: Map<string, ComponentMetadata> = new Map();

/**
 * Registers a component for validation
 */
export function registerComponent(component: any, metadata: ComponentMetadata): void {
  if (!component) {
    logBuildError(
      metadata.name,
      metadata.file,
      `Component registration failed: component is undefined`,
      new Error().stack
    );
    return;
  }
  
  componentsRegistry.set(metadata.name, metadata);
  
  // Verify client directive for client components
  if (metadata.isClient && typeof component === 'function') {
    // For functional components, we can check for display name
    if (!component.toString().includes('use client')) {
      logBuildError(
        metadata.name,
        metadata.file,
        `Client component missing 'use client' directive`,
        new Error().stack
      );
    }
  }
}

/**
 * Cross-validates component dependencies
 */
export function validateComponentDependencies(): void {
  // Check for circular dependencies or missing components
  componentsRegistry.forEach((metadata, componentName) => {
    metadata.imports.forEach(importName => {
      if (!componentsRegistry.has(importName)) {
        logBuildError(
          componentName,
          metadata.file,
          `Component depends on unregistered component: ${importName}`,
          new Error().stack
        );
      }
    });
  });
}

/**
 * Runs all validation tests on registered components
 */
export function runComponentValidations(): boolean {
  validateComponentDependencies();
  
  // Client/Server component boundary checks
  let hasErrors = false;
  componentsRegistry.forEach((metadata, componentName) => {
    if (!metadata.isClient) {
      // Server components should not import client components
      metadata.imports.forEach(importName => {
        const importedComponent = componentsRegistry.get(importName);
        if (importedComponent && importedComponent.isClient) {
          logBuildError(
            componentName,
            metadata.file,
            `Server component imports client component: ${importName}`,
            new Error().stack
          );
          hasErrors = true;
        }
      });
    }
  });
  
  return !hasErrors;
}

/**
 * Utility to validate React component tree for undefined components
 */
export function validateReactTree(element: React.ReactNode, componentPath: string): boolean {
  if (!element) {
    logBuildError(
      'Unknown',
      componentPath,
      'Rendered element is undefined or null',
      new Error().stack
    );
    return false;
  }
  
  // Add more detailed React tree validation if needed
  
  return true;
}
