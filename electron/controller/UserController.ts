import { userService } from "../service/UserService";
import { User } from '../entities/User';  

export class UserController {
  async save(user: User) {
    return userService.save(user);
  }
}