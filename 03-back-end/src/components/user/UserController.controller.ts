import { Request, Response } from "express";
import BaseController from "../../common/BaseController";
import { AddUserValidator, IAddUserDto } from "./dto/IAddUser.dto";
import { EditUserValidator, IEditUserDto } from "./dto/IEditUser.dto";
import * as bcrypt from "bcrypt";

export default class UserController extends BaseController {
  getAll(req: Request, res: Response) {
    this.services.user
      .getAll()
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
      .getById(id)
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

  edit(req: Request, res: Response) {
    const id: number = +req.params?.uid;
    const data = req.body as IEditUserDto;

    if (!EditUserValidator(data)) {
      return res.status(400).send(EditUserValidator.errors);
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(data.password, 10);

    this.services.user
      .getById(id)
      .then((result) => {
        if (result === null) {
          return res.sendStatus(404);
        }

        this.services.user
          .editById(id, {
            username: data.username,
            email: data.email,
            password_hash: passwordHash,
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
      .getById(id)
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
