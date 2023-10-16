import { UserPresenter } from "./Users/Presenter/UserPresenter.js";
import {loginValidator, registerValidator} from "./Validations/validations.js";
import checkAuth from "./Utils/checkAuth.js";

export const Router = (app) => {
  const user = new UserPresenter();

  app.post('/auth/register', registerValidator, user.create.bind(user));
  app.post('/auth/login', loginValidator, user.login.bind(user));
  app.get('/auth/me', checkAuth, user.getMe);
}