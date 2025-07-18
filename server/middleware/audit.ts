import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';

interface AuditLogEntry {
  action: string;
  userId?: string;
  ip?: string;
  userAgent?: string;
  endpoint?: string;
  method?: string;
  requestBody?: any;
  responseStatus?: number;
  timestamp: Date;
  [key: string]: any;
}

class AuditLogger {
  private logDir: string;
  private logFile: string;
  private maxFileSize: number = 10 * 1024 * 1024; // 10MB
  private maxFiles: number = 10;

  constructor() {
    this.logDir = path.join(process.cwd(), 'logs');
    this.logFile = path.join(this.logDir, 'audit.log');
    
    // Create logs directory if it doesn't exist
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private sanitizeForLog(data: any): any {
    if (typeof data === 'string') {
      return data.replace(/password|token|secret|key/gi, '[REDACTED]');
    }
    
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeForLog(item));
    }
    
    if (data && typeof data === 'object') {
      const sanitized: any = {};
      for (const key in data) {
        if (key.toLowerCase().includes('password') || 
            key.toLowerCase().includes('token') || 
            key.toLowerCase().includes('secret') ||
            key.toLowerCase().includes('key')) {
          sanitized[key] = '[REDACTED]';
        } else {
          sanitized[key] = this.sanitizeForLog(data[key]);
        }
      }
      return sanitized;
    }
    
    return data;
  }

  private rotateLogFile(): void {
    try {
      const stats = fs.statSync(this.logFile);
      if (stats.size > this.maxFileSize) {
        // Rotate log files
        for (let i = this.maxFiles - 1; i > 0; i--) {
          const oldFile = `${this.logFile}.${i}`;
          const newFile = `${this.logFile}.${i + 1}`;
          
          if (fs.existsSync(oldFile)) {
            if (i === this.maxFiles - 1) {
              fs.unlinkSync(oldFile); // Delete oldest file
            } else {
              fs.renameSync(oldFile, newFile);
            }
          }
        }
        
        // Move current log to .1
        fs.renameSync(this.logFile, `${this.logFile}.1`);
      }
    } catch (error) {
      console.error('Error rotating log file:', error);
    }
  }

  public log(entry: AuditLogEntry): void {
    try {
      // Rotate log file if necessary
      if (fs.existsSync(this.logFile)) {
        this.rotateLogFile();
      }

      // Sanitize sensitive data
      const sanitizedEntry = this.sanitizeForLog(entry);
      
      // Create log entry with hash for integrity
      const logData = {
        ...sanitizedEntry,
        logId: createHash('sha256').update(JSON.stringify(sanitizedEntry) + Date.now()).digest('hex').substring(0, 16)
      };

      const logLine = JSON.stringify(logData) + '\n';
      
      // Append to log file
      fs.appendFileSync(this.logFile, logLine);
      
      // Also log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[AUDIT] ${entry.action}:`, sanitizedEntry);
      }
    } catch (error) {
      console.error('Error writing audit log:', error);
    }
  }

  public getRecentLogs(limit: number = 100): AuditLogEntry[] {
    try {
      if (!fs.existsSync(this.logFile)) {
        return [];
      }

      const fileContent = fs.readFileSync(this.logFile, 'utf8');
      const lines = fileContent.trim().split('\n');
      
      return lines
        .slice(-limit)
        .map(line => {
          try {
            return JSON.parse(line);
          } catch {
            return null;
          }
        })
        .filter(entry => entry !== null);
    } catch (error) {
      console.error('Error reading audit log:', error);
      return [];
    }
  }

  public searchLogs(filters: {
    action?: string;
    userId?: string;
    startDate?: Date;
    endDate?: Date;
    ip?: string;
  }): AuditLogEntry[] {
    try {
      const logs = this.getRecentLogs(1000); // Get more logs for searching
      
      return logs.filter(log => {
        if (filters.action && log.action !== filters.action) return false;
        if (filters.userId && log.userId !== filters.userId) return false;
        if (filters.ip && log.ip !== filters.ip) return false;
        
        if (filters.startDate && new Date(log.timestamp) < filters.startDate) return false;
        if (filters.endDate && new Date(log.timestamp) > filters.endDate) return false;
        
        return true;
      });
    } catch (error) {
      console.error('Error searching audit logs:', error);
      return [];
    }
  }
}

const auditLogger = new AuditLogger();

export const auditLog = (entry: AuditLogEntry): void => {
  auditLogger.log(entry);
};

export const getAuditLogs = (limit?: number): AuditLogEntry[] => {
  return auditLogger.getRecentLogs(limit);
};

export const searchAuditLogs = (filters: {
  action?: string;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
  ip?: string;
}): AuditLogEntry[] => {
  return auditLogger.searchLogs(filters);
};
