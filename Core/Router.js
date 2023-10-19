import { UserPresenter } from "./Users/Presenter/UserPresenter.js";
import {loginValidator, postValidator, registerValidator} from "./Validations/validations.js";
import checkAuth from "./Utils/checkAuth.js";
import {PostPresenter} from "./Posts/Presenter/PostPresenter.js";
import {check} from "express-validator";

export const Router = (app) => {
  const user = new UserPresenter();
  const posts = new PostPresenter();

  app.post('/auth/register', registerValidator, user.create.bind(user));
  app.post('/auth/login', loginValidator, user.login.bind(user));
  app.get('/auth/me', checkAuth, user.getMe.bind(user));

  app.post('/posts', checkAuth, postValidator, posts.create.bind(posts));
  app.get('/posts', checkAuth, posts.getAllByAuthor.bind(posts));
  app.get('/posts/:id', posts.get);
  app.delete('/posts/:id', checkAuth, posts.delete);
  app.patch('/posts/:id', checkAuth, posts.update);
}