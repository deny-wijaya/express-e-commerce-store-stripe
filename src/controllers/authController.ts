import { NextFunction, Response, Request } from "express";
import { AuthService } from "@/services/AuthService";
import { PostgresUserRepository } from "@/repositories/PostgresUserRepository";
import { LoginRequest, CreateUserRequest } from "@/types/User";

export class AuthController {
  private authService: AuthService;

  constructor() {
    const userRepository = new PostgresUserRepository();
    this.authService = new AuthService(userRepository);
  }

  /**
   * User login endpoint
   * @param req - Express request
   * @param res - Express response
   * @param next - Express next function
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password }: LoginRequest = req.body;

      // Validate input
      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
        return;
      }

      // Attempt login
      const result = await this.authService.login({ email, password });

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(401).json(result);
      }
    } catch (error) {
      console.error('Login controller error:', error);
      next(error);
    }
  }

  /**
   * User registration endpoint
   * @param req - Express request
   * @param res - Express response
   * @param next - Express next function
   */
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, name }: CreateUserRequest = req.body;

      // Validate input
      if (!email || !password || !name) {
        res.status(400).json({
          success: false,
          message: 'Email, password, and name are required'
        });
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({
          success: false,
          message: 'Please provide a valid email address'
        });
        return;
      }

      // Validate password strength
      if (password.length < 6) {
        res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long'
        });
        return;
      }

      // Attempt registration
      const result = await this.authService.register({ email, password, name });

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Registration controller error:', error);
      next(error);
    }
  }

  /**
   * Get user profile endpoint
   * @param req - Express request (with userId from middleware)
   * @param res - Express response
   * @param next - Express next function
   */
  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Assuming userId is added by auth middleware
      const userId = (req as any).userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
        return;
      }

      const user = await this.authService.getUserProfile(userId);

      if (user) {
        res.status(200).json({
          success: true,
          message: 'Profile retrieved successfully',
          data: { user }
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
    } catch (error) {
      console.error('Get profile controller error:', error);
      next(error);
    }
  }
}
