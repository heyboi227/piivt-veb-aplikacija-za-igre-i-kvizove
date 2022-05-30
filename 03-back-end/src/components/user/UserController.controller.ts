import { Request, Response } from "express";
import BaseController from "../../common/BaseController";
import { AddUserValidator, IAddUserDto } from "./dto/IAddUser.dto";
import {
  RegisterUserValidator,
  IRegisterUserDto,
} from "./dto/IRegisterUser.dto";
import * as bcrypt from "bcrypt";
import * as uuid from "uuid";
import UserModel from "./UserModel.model";

export default class UserController extends BaseController {
  getAll(req: Request, res: Response) {
    this.services.user
      .getAll({
        removePassword: true,
        removeEmail: false,
        removeActivationCode: true,
      })
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  getById(req: Request, res: Response) {
    const id: number = +req.params?.uid;

    this.services.user
      .getById(id, {
        removePassword: true,
        removeEmail: false,
        removeActivationCode: true,
      })
      .then((result) => {
        if (result === null) {
          res.status(404).send("User not found!");
        }

        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  getByUsername(req: Request, res: Response) {
    const username: string = req.params?.uusername;

    this.services.user
      .getByUsername(username)
      .then((result) => {
        if (result === null) {
          res.status(404).send("User not found!");
        }

        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  getByEmail(req: Request, res: Response) {
    const email: string = req.params?.uemail;

    this.services.user
      .getByEmail(email)
      .then((result) => {
        if (result === null) {
          res.status(404).send("User not found!");
        }

        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  add(req: Request, res: Response) {
    const data = req.body as IAddUserDto;

    if (!AddUserValidator(data)) {
      return res.status(400).send(AddUserValidator.errors);
    }

    this.services.user
      .add({
        username: data.username,
      })
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(400).send(error?.message);
      });
  }

  activate(req: Request, res: Response) {
    const code: string = req.params?.ucode;

    this.services.user
      .getUserByActivationCode(code, {
        removeActivationCode: true,
        removeEmail: true,
        removePassword: true,
      })
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "User not found!",
          };
        }

        return result;
      })
      .then((result) => {
        const user = result as UserModel;
        this.services.user.editById(user.userId, {
          is_active: 1,
          activation_code: null,
        });
      })
      .then((user) => {
        res.send(user);
      })
      .catch((error) => {
        res.status(error?.status ?? 500).send(error?.message);
      });
  }

  edit(req: Request, res: Response) {
    const id: number = +req.params?.uid;
    const data = req.body as IRegisterUserDto;

    if (!RegisterUserValidator(data)) {
      return res.status(400).send(RegisterUserValidator.errors);
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(data.password, 10);

    this.services.user
      .getById(id, {
        removePassword: true,
        removeEmail: false,
        removeActivationCode: true,
      })
      .then((result) => {
        if (result === null) {
          return res.sendStatus(404);
        }

        this.services.user
          .editById(id, {
            username: data.username,
            email: data.email,
            password_hash: passwordHash,
            activation_code: uuid.v4(),
          })
          .then((result) => {
            res.send(result);
          })
          .catch((error) => {
            res.status(400).send(error?.message);
          });
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  delete(req: Request, res: Response) {
    const id: number = +req.params?.uid;

    this.services.user
      .getById(id, {
        removePassword: false,
        removeEmail: false,
        removeActivationCode: false,
      })
      .then((result) => {
        if (result === null) {
          return res.sendStatus(404);
        }

        this.services.user
          .deleteById(id)
          .then((_result) => {
            res.send("This user has been deleted!");
          })
          .catch((error) => {
            res.status(500).send(error?.message);
          });
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }
}
