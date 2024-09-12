import { UserRepository } from '../repository/UserRepository';
import { User } from '../entities/User';  

class UserService {
  private userRepository = new UserRepository();

  async save(user: User) {
    const repository = await this.userRepository.getRepository();
    repository.save(user);
  }
}

export const userService = new UserService();