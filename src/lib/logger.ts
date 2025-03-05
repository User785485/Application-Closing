// Systu00e8me de logging centralisu00e9 pour toute l'application

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogPayload {
  message: string;
  timestamp: string;
  level: LogLevel;
  data?: any;
  source?: string;
}

class Logger {
  private static instance: Logger;
  private isProduction: boolean;
  private logQueue: LogPayload[] = [];
  private logQueueSize = 50; // Nombre maximum de logs u00e0 conserver en mu00e9moire

  private constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: LogLevel, message: string, data?: any, source?: string): LogPayload {
    return {
      message,
      timestamp: new Date().toISOString(),
      level,
      data,
      source
    };
  }

  private addToQueue(logItem: LogPayload): void {
    this.logQueue.push(logItem);
    if (this.logQueue.length > this.logQueueSize) {
      this.logQueue.shift(); // Supprimer le plus ancien log si la limite est atteinte
    }
  }

  private logToConsole(logItem: LogPayload): void {
    const { level, message, timestamp, data, source } = logItem;
    const sourceInfo = source ? ` [${source}]` : '';
    
    const styles = {
      debug: '\x1b[90m', // Gris
      info: '\x1b[36m',  // Cyan
      warn: '\x1b[33m',  // Jaune
      error: '\x1b[31m', // Rouge
      reset: '\x1b[0m'   // Reset
    };

    // En mode production, on n'affiche pas les logs de debug
    if (this.isProduction && level === 'debug') {
      return;
    }

    // Formater le message pour le console.log
    const formattedMessage = `${styles[level]}[${level.toUpperCase()}]${styles.reset} [${timestamp}]${sourceInfo}: ${message}`;
    
    switch (level) {
      case 'debug':
        console.log(formattedMessage, data || '');
        break;
      case 'info':
        console.info(formattedMessage, data || '');
        break;
      case 'warn':
        console.warn(formattedMessage, data || '');
        break;
      case 'error':
        console.error(formattedMessage, data || '');
        break;
    }
  }

  public debug(message: string, data?: any, source?: string): void {
    const logItem = this.formatMessage('debug', message, data, source);
    this.logToConsole(logItem);
    this.addToQueue(logItem);
  }

  public info(message: string, data?: any, source?: string): void {
    const logItem = this.formatMessage('info', message, data, source);
    this.logToConsole(logItem);
    this.addToQueue(logItem);
  }

  public warn(message: string, data?: any, source?: string): void {
    const logItem = this.formatMessage('warn', message, data, source);
    this.logToConsole(logItem);
    this.addToQueue(logItem);
  }

  public error(message: string, data?: any, source?: string): void {
    const logItem = this.formatMessage('error', message, data, source);
    this.logToConsole(logItem);
    this.addToQueue(logItem);
  }

  public getLogQueue(): LogPayload[] {
    return [...this.logQueue];
  }

  // Pour les intu00e9grations futures
  public async sendLogsToService(): Promise<void> {
    // Ici on pourrait envoyer les logs u00e0 un service comme Sentry, LogRocket, etc.
    if (this.isProduction) {
      // Code pour envoyer les logs u00e0 un service externe
    }
  }

  // Pour le du00e9veloppement et le du00e9bogage
  public printLogSummary(): void {
    const errorCount = this.logQueue.filter(log => log.level === 'error').length;
    const warnCount = this.logQueue.filter(log => log.level === 'warn').length;
    
    console.log(`\n${'-'.repeat(50)}\nRu00e9sumu00e9 des logs:\n- Erreurs: ${errorCount}\n- Avertissements: ${warnCount}\n- Total: ${this.logQueue.length}\n${'-'.repeat(50)}`);
  }
}

// Exporter une instance unique du logger
export const logger = Logger.getInstance();

// Pour utilisation dans des composants React
export function useLogger(source: string) {
  return {
    debug: (message: string, data?: any) => logger.debug(message, data, source),
    info: (message: string, data?: any) => logger.info(message, data, source),
    warn: (message: string, data?: any) => logger.warn(message, data, source),
    error: (message: string, data?: any) => logger.error(message, data, source)
  };
}
