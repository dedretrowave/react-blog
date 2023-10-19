import UserModel from "../Model/UserModel.js";
import {PasswordHash} from "../../Helpers/PasswordHash.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export class UserPresenter {
  async getMe(req, res) {
    try {
      const user = await UserModel.findById(req.userId);

      if (!user) {
        return res
          .status(404)
          .json({
            success: false,
            message: 'User not found',
          })
      }

      res
        .status(200)
        .json({
        success: true,
        user: user,
      })
    } catch (err) {
      console.log(err);

      res
        .status(500)
        .json({
          success: false,
          message: "Authorisation failure"
        })
    }
  }

  async login(req, res) {
    try {
      const user = await UserModel.findOne({email: req.body.email});

      if (!user) {
        return res.status(404).json({
          message: 'Incorrect email or password'
        });
      }

      const isPasswordValid = await bcrypt.compare(req.body.password, user._doc.password);

      if (!isPasswordValid) {
        return res
          .status(404)
          .json({
            message: 'Incorrect email or password'
          });
      }

      res
        .status(200)
        .json({
          success: true,
          ...this.#getUserSession(user),
        })
    } catch (err) {
      console.log(err);

      res
        .status(500)
        .json({
          success: false,
          message: 'Authorisation failure'
        })
    }
  }

  async create(req, res) {
    try {
      req.body.password = await PasswordHash(req.body.password);

      const existingUser = UserModel.findOne({email: req.body.email});

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists',
        })
      }

      const model = new UserModel({
        fullName: req.body.fullName,
        email: req.body.email,
        password: req.body.password,
        avatarUrl: req.body.avatarUrl,
      });

      const user = await model.save();

      res.status(200).json({
        success: true,
        ...this.#getUserSession(user),
        });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        success: false,
        message: err,
      })
    }
  }

  #getUserSession(user) {
    const token = jwt.sign({
        _id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '30d',
      })

    const { password, ...userData } = user._doc;

    return {
      user: userData,
      token: token,
    };
  }
}