import { UserPresenter } from "./Users/Presenter/UserPresenter.js";
import {PostPresenter} from "./Posts/Presenter/PostPresenter.js";
import {loginValidator, postValidator, registerValidator} from "./Validations/validations.js";
import checkAuth from "./Utils/checkAuth.js";
import multer from "multer";
import {handleValidationErrors} from "./Utils/ValidationErrors.js";

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

  app.post('/upload', checkAuth, upload.single('image'),
    (req, res) => {
      res
        .status(200)
        .json({
          success: true,
          url: `uploads/${req.file.originalname}`
        });
    });

  app.post('/auth/register', registerValidator, handleValidationErrors, user.create.bind(user));
  app.post('/auth/login', loginValidator, handleValidationErrors, user.login.bind(user));
  app.get('/auth/me', checkAuth, user.getMe.bind(user));
  app.patch('/auth/:id', checkAuth, user.update.bind(user));

  app.post('/posts', checkAuth, postValidator, handleValidationErrors, posts.create.bind(posts));
  app.get('/posts', posts.getAll.bind(posts));
  app.get('/posts/:id', posts.get.bind(posts));
  app.delete('/posts/:id', checkAuth, posts.delete.bind(posts));
  app.patch('/posts/:id', checkAuth, postValidator, handleValidationErrors, posts.update.bind(posts));
}