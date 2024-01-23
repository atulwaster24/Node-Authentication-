import { jwtVerify } from "../middleware/auth.middleware.js";
import UserRepository from "../repositories/user.repository.js";
import { sendWelcomeMail } from "../utils/email.js";
import dotenv from "dotenv";
dotenv.config();
import Jwt from "jsonwebtoken";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async login(req, res, next) {
    let errorMsg;
    try {
      const { email, password } = req.body;
      const loggedUser = await this.userRepository.loginRepo(email, password);
      if (loggedUser) {
        const token = Jwt.sign(
          { user: loggedUser, isLogged: true },
          process.env.SECRETKEY,
          { expiresIn: "1h" }
        );
        req.session.token = token;
        let dataToRender = {
          title: "Home",
          isLogged: true,
          user: loggedUser.username,
          msg: null,
        };
        return res.render("home", dataToRender);
      }
    } catch (error) {
      errorMsg = error.message;
      console.error(error);
      return res.render("login", {
        title: "Sign Up",
        isLogged: null,
        msg: errorMsg,
      });
    }
  }

  async register(req, res, next) {
    try {
      if (req.session.token) {
        const token = jwtVerify(req.session.token);
        const username = token.payload.user.username;
        let data = {
          title: "Register",
          isLogged: true,
          user: username,
          msg: "You are already logged in. Log out before creating a new account.",
        };
        return res.render("register", data);
      } else {
        const { username, email, password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
          res.render("register", {
            title: "Sign Up",
            isLogged: null,
            msg: "Passwords not matched.",
          });
          throw new Error("Passwords not matched");
        }
        const user = await this.userRepository.registerRepo({
          username,
          email,
          password,
        });
        if (user) {
          // sendWelcomeMail(email);
          res.redirect("login");
        }
      }
    } catch (error) {
      console.log(error);
      return res.render("register", {
        title: "Sign Up",
        isLogged: null,
        msg: error.message,
      });
    }
  }

  async resetPassword(req, res, next) {}

  async logout(req, res, next) {
    try {
      if (req.session.token) {
        res.clearCookie("connect.sid");
        req.session.destroy();
      }
      res.redirect("login");
    } catch (error) {
      console.log(error);
    }
  }

  async forgotPassword(req, res, next) {}
}
