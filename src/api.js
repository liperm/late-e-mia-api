import { getMeController, postUserController } from "./controllers/user.controller.js";
import { loginController } from "./controllers/auth.controller.js";
import { postAppointmentController, getAppointmentsController, getAppointmentController, putAppointmentController, deleteAppointmentController, patchAppointmentStageController } from "./controllers/appointment.controller.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";


export const getUserRoutes = (app) => {
  app.post("/users", postUserController);
  app.get("/users/me", authMiddleware, getMeController);
}

export const getAuthRoutes = (app) => {
  app.post("/auth/login", loginController);
};

export const getAppointmentRoutes = (app) => {
  app.post("/appointments", authMiddleware, postAppointmentController);
  app.get("/appointments", authMiddleware, getAppointmentsController);
  app.get("/appointments/:id", authMiddleware, getAppointmentController);
  app.put("/appointments/:id", authMiddleware, putAppointmentController);
  app.delete("/appointments/:id", authMiddleware, deleteAppointmentController);
  app.patch("/appointments/:id", authMiddleware, patchAppointmentStageController);
};
