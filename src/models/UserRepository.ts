import { User, CreateUserRequest, UserRepository } from '@/models/User';

/**
 * In-memory implementation of UserRepository
 * Dalam production, ini akan diganti dengan database implementation (MongoDB, PostgreSQL, etc.)
 */
export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  /**
   * Generate simple ID
   * @returns string
   */
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Find user by email
   * @param email - User email
   * @returns Promise<User | null>
   */
  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    return user || null;
  }

  /**
   * Create new user
   * @param userData - User creation data
   * @returns Promise<User>
   */
  async create(userData: CreateUserRequest): Promise<User> {
    const newUser: User = {
      id: this.generateId(),
      email: userData.email.toLowerCase(),
      password: userData.password,
      name: userData.name,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.users.push(newUser);
    return newUser;
  }

  /**
   * Find user by ID
   * @param id - User ID
   * @returns Promise<User | null>
   */
  async findById(id: string): Promise<User | null> {
    const user = this.users.find(u => u.id === id);
    return user || null;
  }

  /**
   * Get all users (for debugging purposes)
   * @returns User[]
   */
  getAllUsers(): Omit<User, 'password'>[] {
    return this.users.map(({ password, ...user }) => user);
  }

  /**
   * Clear all users (for testing purposes)
   */
  clearAll(): void {
    this.users = [];
  }
}