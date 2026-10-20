import { NextFunction, Response, Request } from "express";
import { AuthService } from "@/services/AuthService";
import { InMemoryUserRepository } from "@/models/UserRepository";

// Create auth service instance
const userRepository = new InMemoryUserRepository();
const authService = new AuthService(userRepository);

/**
 * Middleware untuk validasi input login
 */
export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address'
    });
  }

  next();
};

/**
 * Middleware untuk validasi input register
 */
export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const { email, password, name } = req.body;

  // Check if all required fields are provided
  if (!email || !password || !name) {
    return res.status(400).json({
      success: false,
      message: 'Email, password, and name are required'
    });
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address'
    });
  }

  // Password strength validation
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long'
    });
  }

  // Name validation
  if (name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Name must be at least 2 characters long'
    });
  }

  next();
};

/**
 * Middleware untuk autentikasi JWT token
 */
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    // Verify token
    const decoded = await authService.verifyToken(token);
    if (!decoded) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Add userId to request object
    (req as any).userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Token authentication error:', error);
    return res.status(403).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

/**
 * Middleware untuk optional authentication (tidak wajib login)
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = await authService.verifyToken(token);
      if (decoded) {
        (req as any).userId = decoded.userId;
      }
    }

    next();
  } catch (error) {
    // Ignore errors for optional auth
    next();
  }
};
