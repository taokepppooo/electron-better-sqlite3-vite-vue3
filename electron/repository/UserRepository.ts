import { BaseRepository } from './BaseRepository';
import { User } from '../entities/User';

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(User);
  }
}  