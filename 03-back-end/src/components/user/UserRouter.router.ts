import * as express from "express";
import AuthMiddleware from "../../../middlewares/AuthMiddleware";
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";
import UserController from "./UserController.controller";

class UserRouter implements IRouter {
  setupRoutes(
    application: express.Application,
    resources: IApplicationResources
  ) {
    const userController: UserController = new UserController(
      resources.services
    );

    application.get("/api/user", userController.getAll.bind(userController));
    application.get(
      "/api/user/:uid",
      AuthMiddleware.getVerifier("user", "activeUser"),
      userController.getById.bind(userController)
    );
    application.get(
      "/api/user/username/:uusername",
      AuthMiddleware.getVerifier("user", "activeUser"),
      userController.getByUsername.bind(userController)
    );
    application.get(
      "/api/user/email/:uemail",
      AuthMiddleware.getVerifier("user", "activeUser"),
      userController.getByEmail.bind(userController)
    );
    application.post("/api/user", userController.add.bind(userController));
    application.put(
      "/api/user/:uid",
      AuthMiddleware.getVerifier("user", "activeUser"),
      userController.edit.bind(userController)
    );
    application.delete(
      "/api/user/:uid",
      userController.delete.bind(userController)
    );
    application.get(
      "/api/user/activate/:ucode",
      userController.activate.bind(userController)
    );
  }
}

export default UserRouter;
