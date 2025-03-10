import bcrypt from "bcryptjs";
import UserModel, { IUser } from "../database/models/UserModel.js";

export class UserRepository {
  async createUser(email: string, password: string): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return UserModel.create({ email, password: hashedPassword });
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email }).exec();
  }

  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
