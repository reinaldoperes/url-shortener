import { Request, Response } from "express";
import { UserRepository } from "../../infrastructure/repositories/UserRepository.js";
import { RegisterUser } from "../../application/use-cases/RegisterUser.js";
import { LoginUser } from "../../application/use-cases/LoginUser.js";

export class AuthController {
  private userRepository: UserRepository;
  private registerUser: RegisterUser;
  private loginUser: LoginUser;

  constructor() {
    this.userRepository = new UserRepository();
    this.registerUser = new RegisterUser(this.userRepository);
    this.loginUser = new LoginUser(this.userRepository);

    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
  }

  async register(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      const user = await this.registerUser.execute(email, password);
      return res
        .status(201)
        .json({ message: "User created", userId: user._id });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      const token = await this.loginUser.execute(email, password);
      return res.json({ token });
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  }
}
