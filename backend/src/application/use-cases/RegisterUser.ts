import { UserRepository } from "../../infrastructure/repositories/UserRepository.js";
import { IUser } from "../../infrastructure/database/models/UserModel.js";

export class RegisterUser {
  constructor(private userRepository: UserRepository) {}

  async execute(email: string, password: string): Promise<IUser> {
    const existingUser = await this.userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }
    return this.userRepository.createUser(email, password);
  }
}
