import { Request, Response } from "express";
import { UserRepository } from "../../infrastructure/repositories/UserRepository.js";
import { RegisterUser } from "../../application/use-cases/RegisterUser.js";
import { LoginUser } from "../../application/use-cases/LoginUser.js";
import {
  serializeJsonApi,
  serializeError,
} from "../../utils/jsonApiSerializer.js";

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
          .json(serializeError(400, "Email and password are required"));
      }

      const user = await this.registerUser.execute(email, password);
      return res
        .status(201)
        .json(serializeJsonApi("users", { id: user._id, email: user.email }));
    } catch (error: any) {
      return res
        .status(400)
        .json(serializeError(400, "Registration failed", error.message));
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json(serializeError(400, "Email and password are required"));
      }

      const token = await this.loginUser.execute(email, password);
      return res.json(serializeJsonApi("tokens", { token }));
    } catch (error: any) {
      return res
        .status(401)
        .json(serializeError(401, "Authentication failed", error.message));
    }
  }
}
