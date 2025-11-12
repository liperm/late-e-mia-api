import { getMeController, postUserController } from "./controllers/user.controller.js";
import { loginController } from "./controllers/auth.controller.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";


export const getUserRoutes = (app) => {
  app.post("/users", postUserController);
  app.get("/users/me", authMiddleware, getMeController);
}

export const getAuthRoutes = (app) => {
  app.post("/auth/login", loginController);
};
