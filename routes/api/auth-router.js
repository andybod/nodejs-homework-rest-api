import express from "express";

import userControllers from "../../controllers/user-controllers.js";

import usersSchemas from "../../schemas/users-schemas.js";

import { validateBody } from "../../decorators/index.js";

import { authenticate } from "../../middlewares/index.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(usersSchemas.userSignupSchema),
  userControllers.signup
);
authRouter.post(
  "/login",
  validateBody(usersSchemas.userSigninSchema),
  userControllers.signin
);
authRouter.post("/logout", authenticate, userControllers.logout);

authRouter.get("/current", authenticate, userControllers.getCurrent);
authRouter.patch(
  "/",
  authenticate,
  validateBody(usersSchemas.userUpdateSchemas),
  userControllers.updateSubscription
);
export default authRouter;
