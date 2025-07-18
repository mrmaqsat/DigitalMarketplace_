import { Request, Response, NextFunction } from 'express';
import { IUser } from '@shared/models.js';
import { auditLog } from './audit.js';

interface AuthenticatedRequest extends Request {
  user?: IUser;
}

// Ensure user is authenticated
export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    auditLog({
      action: 'UNAUTHORIZED_ACCESS_ATTEMPT',
      ip: req.ip,
      userAgent: req.get('user-agent') || 'unknown',
      endpoint: req.path,
      method: req.method,
      timestamp: new Date()
    });
    
    return res.status(401).json({ 
      error: 'Authentication required',
      message: 'Please log in to access this resource' 
    });
  }
  next();
};

// Role-based authorization
export const requireRole = (roles: string | string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'Please log in to access this resource' 
      });
    }

    const userRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!userRoles.includes(req.user!.role)) {
      auditLog({
        action: 'UNAUTHORIZED_ROLE_ACCESS',
        userId: req.user!._id.toString(),
        userRole: req.user!.role,
        requiredRoles: userRoles,
        ip: req.ip,
        userAgent: req.get('user-agent') || 'unknown',
        endpoint: req.path,
        method: req.method,
        timestamp: new Date()
      });
      
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        message: 'You do not have permission to access this resource' 
      });
    }
    
    next();
  };
};

// Check if user owns the resource (for products, orders, etc.)
export const requireOwnership = (getResourceOwnerId: (req: AuthenticatedRequest) => Promise<string | null>) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'Please log in to access this resource' 
      });
    }

    try {
      const resourceOwnerId = await getResourceOwnerId(req);
      
      if (!resourceOwnerId) {
        return res.status(404).json({ 
          error: 'Resource not found',
          message: 'The requested resource does not exist' 
        });
      }
      
      const userId = req.user!._id.toString();
      const isAdmin = req.user!.role === 'admin';
      
      if (resourceOwnerId !== userId && !isAdmin) {
        auditLog({
          action: 'UNAUTHORIZED_RESOURCE_ACCESS',
          userId: userId,
          resourceOwnerId: resourceOwnerId,
          ip: req.ip,
          userAgent: req.get('user-agent') || 'unknown',
          endpoint: req.path,
          method: req.method,
          timestamp: new Date()
        });
        
        return res.status(403).json({ 
          error: 'Access denied',
          message: 'You can only access your own resources' 
        });
      }
      
      next();
    } catch (error) {
      return res.status(500).json({ 
        error: 'Authorization check failed',
        message: 'Unable to verify resource ownership' 
      });
    }
  };
};

// Prevent privilege escalation
export const preventPrivilegeEscalation = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (req.body && req.body.role) {
    const currentUserRole = req.user!.role;
    const targetRole = req.body.role;
    
    // Only admins can change roles
    if (currentUserRole !== 'admin') {
      delete req.body.role;
      auditLog({
        action: 'PRIVILEGE_ESCALATION_ATTEMPT',
        userId: req.user!._id.toString(),
        currentRole: currentUserRole,
        targetRole: targetRole,
        ip: req.ip,
        userAgent: req.get('user-agent') || 'unknown',
        endpoint: req.path,
        method: req.method,
        timestamp: new Date()
      });
    }
    
    // Prevent admins from accidentally demoting themselves
    if (currentUserRole === 'admin' && req.params.id === req.user!._id.toString() && targetRole !== 'admin') {
      auditLog({
        action: 'ADMIN_SELF_DEMOTION_ATTEMPT',
        userId: req.user!._id.toString(),
        currentRole: currentUserRole,
        targetRole: targetRole,
        ip: req.ip,
        userAgent: req.get('user-agent') || 'unknown',
        endpoint: req.path,
        method: req.method,
        timestamp: new Date()
      });
      
      return res.status(400).json({ 
        error: 'Invalid operation',
        message: 'Cannot demote yourself from admin role' 
      });
    }
  }
  
  next();
};

// Log sensitive operations
export const logSensitiveOperation = (operation: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const originalJson = res.json;
    
    res.json = function (body: any) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        auditLog({
          action: operation,
          userId: req.user?._id.toString(),
          ip: req.ip,
          userAgent: req.get('user-agent') || 'unknown',
          endpoint: req.path,
          method: req.method,
          requestBody: req.body,
          responseStatus: res.statusCode,
          timestamp: new Date()
        });
      }
      
      return originalJson.call(this, body);
    };
    
    next();
  };
};
