import {validationResult} from "express-validator";
import CommentModel from "../Model/CommentModel.js";
import PostModel from "../../Model/PostModel.js";

export class CommentPresenter {
  async create(req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({
            success: false,
            errors: errors.array(),
          });
      }

      const model = new CommentModel({
        text: req.body.text,
        author: req.userId,
      });

      const comment = await model.save();

      await PostModel.findOneAndUpdate({
        _id: req.body.postId,
      }, {
        $push: {
          comments: model._doc._id,
        },
      }, {
        returnDocument: 'after',
      });

      await comment
        .populate('author');

      res
        .status(200)
        .json({
          success: true,
          comment: comment,
        });
    } catch (err) {
      console.log(err);

      res
        .status(500)
        .json({
          success: false,
          message: 'Comment create failed',
        })
    }
  }
}