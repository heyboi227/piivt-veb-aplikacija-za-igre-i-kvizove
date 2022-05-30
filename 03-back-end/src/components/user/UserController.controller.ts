import { Request, Response } from "express";
import BaseController from "../../common/BaseController";
import { AddUserValidator, IAddUserDto } from "./dto/IAddUser.dto";
import {
  RegisterUserValidator,
  IRegisterUserDto,
} from "./dto/IRegisterUser.dto";
import * as bcrypt from "bcrypt";
import * as uuid from "uuid";
import * as nodemailer from "nodemailer";
import * as Mailer from "nodemailer/lib/mailer";
import * as mail from "nodemailer/lib/mailer";
import UserModel from "./UserModel.model";
import { DevConfig } from "../../configs";

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

  private async sendRegistrationEmail(user: UserModel): Promise<UserModel> {
    return new Promise((resolve, reject) => {
      const transport = nodemailer.createTransport(
        {
          host: DevConfig.mail.host,
          port: DevConfig.mail.port,
          secure: false,
          tls: {
            ciphers: "SSLv3",
          },
          debug: DevConfig.mail.debug,
          auth: {
            user: DevConfig.mail.email,
            pass: DevConfig.mail.password,
          },
        },
        {
          from: DevConfig.mail.email,
        }
      );

      const mailOptions: Mailer.Options = {
        to: user.email,
        subject: "Account registration",
        html: `<!DOCTYPE html>
                <html>
                  <head><meta charset="utf-8"></head>
                  <body>
                    <p>Dear ${user.username},<br>
                      Your account was succesfully created.
                    </p>
                    <p>
                      You must activate your account by clicking on the following link:
                    </p>
                    <p style="text-align: center; padding: 10px;">
                      <a href="http://localhost:10000/api/user/activate/${user.activationCode}">Activate</a>
                  </body>
                </html>`,
      };

      transport
        .sendMail(mailOptions)
        .then(() => {
          transport.close();
          user.activationCode = null;
          resolve(user);
        })
        .catch((error) => {
          transport.close();
          reject({
            message: error?.message,
          });
        });
    });
  }

  private async sendActivationEmail(user: UserModel): Promise<UserModel> {
    return new Promise((resolve, reject) => {
      const transport = nodemailer.createTransport(
        {
          host: DevConfig.mail.host,
          port: DevConfig.mail.port,
          secure: false,
          tls: {
            ciphers: "SSLv3",
          },
          debug: DevConfig.mail.debug,
          auth: {
            user: DevConfig.mail.email,
            pass: DevConfig.mail.password,
          },
        },
        {
          from: DevConfig.mail.email,
        }
      );

      const mailOptions: Mailer.Options = {
        to: user.email,
        subject: "Account activation",
        html: `<!doctype html>
                <html>
                    <head><meta charset="utf-8"></head>
                    <body>
                        <p>
                            Dear ${user.username},<br>
                            Your account was successfully activated.
                        </p>
                        <p>
                            You can now log into your account using the login form.
                        </p>
                    </body>
                </html>`,
      };

      transport
        .sendMail(mailOptions)
        .then(() => {
          transport.close();
          user.activationCode = null;
          resolve(user);
        })
        .catch((error) => {
          transport.close();
          reject({
            message: error?.message,
          });
        });
    });
  }

  activate(req: Request, res: Response) {
    const code: string = req.params?.ucode;

    this.services.user
      .getUserByActivationCode(code, {
        removeActivationCode: false,
        removeEmail: false,
        removePassword: false,
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
        return this.services.user.editById(user.userId, {
          is_active: 1,
          activation_code: null,
        });
      })
      .then((user) => {
        return this.sendActivationEmail(user);
      })
      .then((user) => {
        res.send(user);
      })
      .catch((error) => {
        setTimeout(() => {
          res.status(error?.status ?? 500).send(error?.message);
        }, 500);
      });
  }

  edit(req: Request, res: Response) {
    const id: number = +req.params?.uid;
    const data = req.body as IRegisterUserDto;

    if (!RegisterUserValidator(data)) {
      return res.status(400).send(RegisterUserValidator.errors);
    }

    const passwordHash = bcrypt.hashSync(data.password, 10);

    this.services.user.startTransaction().then(() => {
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
        })
        .then(async () => {
          try {
            const user = await this.services.user.editById(id, {
              username: data.username,
              email: data.email,
              password_hash: passwordHash,
              activation_code: uuid.v4(),
            });
            const sendEmail = await this.sendRegistrationEmail(user);
            await this.services.user.commitChanges();
            const editedUser = await sendEmail;
            res.send(editedUser);
          } catch (error) {
            res.status(400).send(error?.message);
          }
        })
        .catch(async (error) => {
          await this.services.user.rollbackChanges();
          res.status(500).send(error?.message);
        });
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
