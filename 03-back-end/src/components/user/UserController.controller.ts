import { Request, Response } from "express";
import BaseController from "../../common/BaseController";
import { AddUserValidator, IAddUserDto } from "./dto/IAddUser.dto";
import { EditUserValidator, IEditUserDto } from "./dto/IEditUser.dto";

export default class UserController extends BaseController {
  async getAll(req: Request, res: Response) {
    this.services.user
      .getAll()
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  async getById(req: Request, res: Response) {
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

  async add(req: Request, res: Response) {
    const data = req.body as IAddUserDto;

    if (!AddUserValidator(data)) {
      return res.status(400).send(AddUserValidator.errors);
    }

    this.services.user
      .add({
        username: data.username,
        email: data.email,
        password_hash: data.password,
      })
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(400).send(error?.message);
      });
  }

  async edit(req: Request, res: Response) {
    const id: number = +req.params?.uid;
    const data = req.body as IEditUserDto;

    if (!EditUserValidator(data)) {
      return res.status(400).send(EditUserValidator.errors);
    }

    this.services.user
      .getById(id)
      .then((result) => {
        if (result === null) {
          return res.sendStatus(404);
        }

        this.services.user
          .editById(id, {
            username: data.username,
            password_hash: data.password,
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

  async delete(req: Request, res: Response) {
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
