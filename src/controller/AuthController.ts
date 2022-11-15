import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import * as jwt from 'jsonwebtoken';
import config from "../config/config";

class AuthController {

  static login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    if ((!username) && (!password)) {
      res.status(400).json({ message: "Username and password are required" });
    }
    const authRepository = AppDataSource.getRepository(User);
    let user: User;
    try {
      user = await authRepository.findOneOrFail({ where: { username: username } });
    } catch (error) {
      return res.status(452).json({ message: "Username or password is incorrect" });
    }
    if (!user.checkPassword(password)) {
      return res.status(452).json({ message: "Username or password is incorrect" });
    }
    const token= jwt.sign({userId: user.id,username:user.username},config.jwtSecret,{expiresIn:'1h'})
    //enviamos al front el mensaje, token y rol desde la res user
    res.json({message:'ok',token,role:user.role, id:user.id,username})
  }


}
export default AuthController;
