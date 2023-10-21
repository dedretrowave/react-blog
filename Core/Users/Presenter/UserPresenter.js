import UserModel from "../Model/UserModel.js";
import {PasswordHash} from "../../Helpers/PasswordHash.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export class UserPresenter {
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
          user: {
            ...user._doc,
            avatarUrl: `http://localhost:1488/${user.avatarUrl}`,
          },
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

  async update(req, res) {
    try {
      const userId = req.params.id;

      await UserModel.updateOne({
        _id: userId,
      }, {
        fullName: req.body.title,
        email: req.body.email,
        password: req.body.password,
        avatarUrl: req.body.avatarUrl,
      });

      res.json({
        success: true,
        message: 'User updated',
      })
    } catch (err) {
      console.log(err);

      res.status(500).json({
        success: false,
        message: 'User update failed'
      });
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
      user: {
        ...userData,
        avatarUrl: `http://localhost:1488/${userData.avatarUrl}`,
      },
      token: token,
    };
  }
}