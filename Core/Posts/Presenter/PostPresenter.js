import {validationResult} from "express-validator";
import UserModel from "../../Users/Model/UserModel.js";
import PostModel from "../Model/PostModel.js";

export class PostPresenter {
  async get(req, res) {
    try {
      const postId = req.params.id;

      await PostModel.findOneAndUpdate({
        _id: postId
      }, {
        $inc: { viewsCount: 1 },
      }, {
        returnDocument: 'after',
      }).then((doc) => {
        if (!doc) {
          return res
            .status(404)
            .json({
              success: false,
              message: 'Article not found',
            })
        }

        return res
          .status(200)
          .json({
            success: true,
            doc,
          })
      })
        .catch(err => {
          console.log(err);
          return res
            .status(500)
            .json({
              success: false,
              message: 'Couldn\'t get article',
            })
        });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        success: false,
        message: 'Post read failed'
      });
    }
  }
  async getAllByAuthor(req, res) {
    try {
      const postsAll = await PostModel.find().populate('author').exec();

      postsAll.reduce(post => post.author._id === req.userId);

      if (postsAll.length === 0) {
        return res
          .status(404)
          .json({
            success: false,
            message: 'Posts not found',
          })
      }

      res
        .status(200)
        .json({
          success: true,
          posts: postsAll,
        })
    } catch (err) {
      console.log(err);

      res.status(500).json({success: false, message: 'Get All by author failed'});
    }
  }
  async create(req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const model = new PostModel({
        title: req.body.title,
        text: req.body.text,
        tags: req.body.tags,
        imageUrl: req.body.imageUrl,
        author: req.userId,
      });

      const post = await model.save();

      res
        .status(200)
        .json({
          success: true,
          post: post._doc,
        })
    } catch (err) {
      console.log(err);

      res
        .status(500)
        .json({
          success: false,
          message: "Post creation Failure",
        })
    }
  }
  async delete(req, res) {
    try {
      const postId = req.params.id;

      await PostModel.findOneAndDelete({
        _id: postId,
      })
        .then(doc => {
          return res
            .status(200)
            .json({
              success: true,
              message: 'Post deleted',
            })
        })
        .catch(err => {
          return res
            .status(500)
            .json({
              success: false,
              message: 'Post delete failed',
            })
        });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        success: false,
        message: 'Post delete failed'
      });
    }
  }

  async update(req, res) {
    try {
      const postId = req.params.id;

      await PostModel.updateOne({
        _id: postId
      }, {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
      });

      res.json({
        success: true,
        message: 'Article updated',
      })
    } catch (err) {
      console.log(err);

      res.status(500).json({
        success: false,
        message: 'Post update failed'
      });
    }
  }
}