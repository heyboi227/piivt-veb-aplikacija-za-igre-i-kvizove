import * as express from "express";
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
      userController.getById.bind(userController)
    );
    application.post("/api/user", userController.add.bind(userController));
    application.put("/api/user/:uid", userController.edit.bind(userController));
    application.delete(
      "/api/user/:uid",
      userController.delete.bind(userController)
    );
  }
}

export default UserRouter;
