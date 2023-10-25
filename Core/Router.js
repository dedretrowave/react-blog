import { UserPresenter } from "./Users/Presenter/UserPresenter.js";
import {PostPresenter} from "./Posts/Presenter/PostPresenter.js";
import {commentValidator, loginValidator, postValidator, registerValidator} from "./Validations/validations.js";
import checkAuth from "./Middleware/checkAuth.js";
import multer from "multer";
import {handleValidationErrors} from "./Middleware/ValidationErrors.js";
import {CommentPresenter} from "./Posts/Comments/Presenter/CommentPresenter.js";
import path from 'path';

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({storage});

export const Router = (app) => {
  const user = new UserPresenter();
  const posts = new PostPresenter();
  const comments = new CommentPresenter();

  app.post('/api/upload', upload.single('image'),
    (req, res) => {
      res
        .status(200)
        .json({
          success: true,
          url: `uploads/${req.file.originalname}`
        });
    });

  app.post('/api/auth/register', registerValidator, handleValidationErrors, user.create.bind(user));
  app.post('/api/auth/login', loginValidator, handleValidationErrors, user.login.bind(user));
  app.get('/api/auth/me', checkAuth, user.getMe.bind(user));
  app.patch('/api/auth/:id', checkAuth, user.update.bind(user));

  app.post('/api/posts', checkAuth, postValidator, handleValidationErrors, posts.create.bind(posts));
  app.get('/api/posts', posts.getAll.bind(posts));
  app.get('/api/posts/tags', posts.getAllTags.bind(posts));
  app.get('/api/posts/:id', posts.getOne.bind(posts));
  app.delete('/api/posts/:id', checkAuth, posts.delete.bind(posts));
  app.patch('/api/posts/:id', checkAuth, posts.update.bind(posts));

  app.post('/api/comments', checkAuth, commentValidator, handleValidationErrors, comments.create.bind(comments));

  app.get('*', (req, res) => {
    res
      .status(200)
      .sendFile(path
        .join(`${path.resolve()}/public/index.html`));
  });
}