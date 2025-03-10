import jwt from "jsonwebtoken";
import { UserRepository } from "../../infrastructure/repositories/UserRepository.js";

export class LoginUser {
  constructor(private userRepository: UserRepository) {}

  async execute(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await this.userRepository.validatePassword(
      password,
      user.password,
    );
    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    return jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" },
    );
  }
}
