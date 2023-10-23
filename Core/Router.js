import { UserPresenter } from "./Users/Presenter/UserPresenter.js";
import {PostPresenter} from "./Posts/Presenter/PostPresenter.js";
import {loginValidator, postValidator, registerValidator} from "./Validations/validations.js";
import checkAuth from "./Middleware/checkAuth.js";
import multer from "multer";
import {handleValidationErrors} from "./Middleware/ValidationErrors.js";

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

  app.post('/upload', upload.single('image'),
    (req, res) => {
      res
        .status(200)
        .json({
          success: true,
          url: `${process.env.HOSTNAME}:${process.env.SERVER_PORT}/uploads/${req.file.originalname}`
        });
    });

  app.post('/auth/register', registerValidator, handleValidationErrors, user.create.bind(user));
  app.post('/auth/login', loginValidator, handleValidationErrors, user.login.bind(user));
  app.get('/auth/me', checkAuth, user.getMe.bind(user));
  app.patch('/auth/:id', checkAuth, user.update.bind(user));

  app.post('/posts', checkAuth, postValidator, handleValidationErrors, posts.create.bind(posts));
  app.get('/posts', posts.getAll.bind(posts));
  app.get('/posts/tags', posts.getAllTags.bind(posts));
  app.get('/posts/:id', posts.getOne.bind(posts));
  app.delete('/posts/:id', checkAuth, posts.delete.bind(posts));
  app.patch('/posts/:id', checkAuth, posts.update.bind(posts));
}