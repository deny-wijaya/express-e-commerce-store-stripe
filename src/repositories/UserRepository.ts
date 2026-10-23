import { User, CreateUserRequest } from '@/types/User';

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(userData: CreateUserRequest): Promise<User>;
  findById(id: string): Promise<User | null>;
}
