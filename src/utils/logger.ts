"use client";

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerOptions {
  enableConsole?: boolean;
  minLevel?: LogLevel;
  context?: string;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

export class Logger {
  private context: string;
  private enableConsole: boolean;
  private minLevel: LogLevel;

  constructor(options: LoggerOptions = {}) {
    this.context = options.context || 'App';
    this.enableConsole = options.enableConsole !== false;
    this.minLevel = options.minLevel || 'debug';
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.minLevel];
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] [${this.context}] ${message}`;
  }

  debug(message: string, ...args: any[]): void {
    if (!this.shouldLog('debug')) return;
    
    const formattedMessage = this.formatMessage('debug', message);
    if (this.enableConsole) {
      console.debug(formattedMessage, ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    if (!this.shouldLog('info')) return;
    
    const formattedMessage = this.formatMessage('info', message);
    if (this.enableConsole) {
      console.info(formattedMessage, ...args);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (!this.shouldLog('warn')) return;
    
    const formattedMessage = this.formatMessage('warn', message);
    if (this.enableConsole) {
      console.warn(formattedMessage, ...args);
    }
  }

  error(message: string, ...args: any[]): void {
    if (!this.shouldLog('error')) return;
    
    const formattedMessage = this.formatMessage('error', message);
    if (this.enableConsole) {
      console.error(formattedMessage, ...args);
    }
  }

  // Spécifique aux problèmes de composants UI
  componentWarning(componentName: string, issue: string): void {
    this.warn(`Component issue: ${componentName} - ${issue}`);
  }

  // Spécifique aux problèmes de Tailwind
  tailwindWarning(feature: string, issue: string): void {
    this.warn(`Tailwind CSS issue: ${feature} - ${issue}`);
  }
}

// Création d'un logger global
export const appLogger = new Logger({
  context: 'MyMuqabala',
  minLevel: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
});

// Loggers spécifiques pour différentes parties de l'application
export const uiLogger = new Logger({
  context: 'UI',
  minLevel: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
});

export const tailwindLogger = new Logger({
  context: 'Tailwind',
  minLevel: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
});
