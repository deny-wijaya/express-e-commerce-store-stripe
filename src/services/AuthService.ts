import crypto from 'crypto';
import { User, CreateUserRequest, LoginRequest, AuthResponse, UserRepository } from '@/models/User';

export class AuthService {
  private userRepository: UserRepository;
  private jwtSecret: string;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
  }

  /**
   * Hash password using crypto
   * @param password - Plain text password
   * @returns string - Hashed password
   */
  private hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
  }

  /**
   * Verify password
   * @param password - Plain text password
   * @param hashedPassword - Hashed password from database
   * @returns boolean
   */
  private verifyPassword(password: string, hashedPassword: string): boolean {
    const parts = hashedPassword.split(':');
    if (parts.length !== 2) return false;
    
    const salt = parts[0];
    const hash = parts[1];
    if (!salt || !hash) return false;
    
    const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === verifyHash;
  }

  /**
   * Generate simple JWT-like token
   * @param userId - User ID
   * @returns string - Token
   */
  private generateToken(userId: string): string {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
    const payload = Buffer.from(JSON.stringify({ 
      userId, 
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    })).toString('base64');
    
    const signature = crypto
      .createHmac('sha256', this.jwtSecret)
      .update(`${header}.${payload}`)
      .digest('base64');
    
    return `${header}.${payload}.${signature}`;
  }

  /**
   * Verify token
   * @param token - JWT-like token
   * @returns { userId: string } | null
   */
  private verifyTokenSync(token: string): { userId: string } | null {
    try {
      const [header, payload, signature] = token.split('.');
      
      // Verify signature
      const expectedSignature = crypto
        .createHmac('sha256', this.jwtSecret)
        .update(`${header}.${payload}`)
        .digest('base64');
      
      if (signature !== expectedSignature) {
        return null;
      }
      
      // Decode payload
      if (!payload) return null;
      const decodedPayload = JSON.parse(Buffer.from(payload, 'base64').toString());
      
      // Check expiration
      if (decodedPayload.exp < Date.now()) {
        return null;
      }
      
      return { userId: decodedPayload.userId };
    } catch (error) {
      return null;
    }
  }

  /**
   * Register new user
   * @param userData - User registration data
   * @returns Promise<AuthResponse>
   */
  async register(userData: CreateUserRequest): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser) {
        return {
          success: false,
          message: 'User with this email already exists'
        };
      }

      // Hash password
      const hashedPassword = this.hashPassword(userData.password);

      // Create user
      const newUser = await this.userRepository.create({
        ...userData,
        password: hashedPassword
      });

      // Generate token
      const token = this.generateToken(newUser.id);

      // Remove password from response
      const { password, ...userWithoutPassword } = newUser;

      return {
        success: true,
        message: 'User registered successfully',
        data: {
          user: userWithoutPassword,
          token
        }
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Registration failed. Please try again.'
      };
    }
  }

  /**
   * Login user
   * @param loginData - User login credentials
   * @returns Promise<AuthResponse>
   */
  async login(loginData: LoginRequest): Promise<AuthResponse> {
    try {
      // Find user by email
      const user = await this.userRepository.findByEmail(loginData.email);
      if (!user) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }

      // Verify password
      const isPasswordValid = this.verifyPassword(loginData.password, user.password);
      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }

      // Generate token
      const token = this.generateToken(user.id);

      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      return {
        success: true,
        message: 'Login successful',
        data: {
          user: userWithoutPassword,
          token
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed. Please try again.'
      };
    }
  }

  /**
   * Verify JWT token
   * @param token - JWT token
   * @returns Promise<{ userId: string } | null>
   */
  async verifyToken(token: string): Promise<{ userId: string } | null> {
    return this.verifyTokenSync(token);
  }

  /**
   * Get user profile by ID
   * @param userId - User ID
   * @returns Promise<User | null>
   */
  async getUserProfile(userId: string): Promise<Omit<User, 'password'> | null> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return null;
      }

      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('Get user profile error:', error);
      return null;
    }
  }
}