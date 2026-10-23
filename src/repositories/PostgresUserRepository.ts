import { User, CreateUserRequest } from '@/types/User';
import { UserRepository } from '@/repositories/UserRepository';
import { UserModel } from '@/models/UserModel';

export class PostgresUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ where: { email: email.toLowerCase() } });
    return user ? user.get({ plain: true }) : null;
  }

  async create(userData: CreateUserRequest): Promise<User> {
    const user = await UserModel.create({ ...userData, email: userData.email.toLowerCase() });
    return user.get({ plain: true });
  }

  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findByPk(id);
    return user ? user.get({ plain: true }) : null;
  }
}
