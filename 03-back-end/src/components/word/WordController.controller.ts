import { Request, Response } from "express";
import { AddWordValidator, IAddWordDto } from "./dto/IAddWord.dto";
import { EditWordValidator, IEditWordDto } from "./dto/IEditWord.dto";
import BaseController from "../../common/BaseController";
class WordController extends BaseController {
  getAll(_req: Request, res: Response) {
    this.services.word
      .getAll({})
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        setTimeout(() => {
          res.status(500).send(error?.message);
        }, 500);
      });
  }

  getById(req: Request, res: Response) {
    const id: number = +req.params?.wid;

    this.services.word
      .getById(id, {})
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "The word is not found!",
          };
        }

        res.send(result);
      })
      .catch((error) => {
        setTimeout(() => {
          res.status(error?.status ?? 500).send(error?.message);
        }, 500);
      });
  }

  getByName(req: Request, res: Response) {
    const name: string = req.params?.wname;

    this.services.word
      .getByName(name)
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "The word is not found!",
          };
        }

        res.send(result);
      })
      .catch((error) => {
        setTimeout(() => {
          res.status(error?.status ?? 500).send(error?.message);
        }, 500);
      });
  }

  add(req: Request, res: Response) {
    const data = req.body as IAddWordDto;

    if (!AddWordValidator(data)) {
      return res.status(400).send(AddWordValidator.errors);
    }

    this.services.word.startTransaction().then(() => {
      this.services.word
        .add(data)
        .then(async (result) => {
          await this.services.word.commitChanges();
          res.send(result);
        })
        .catch(async (error) => {
          await this.services.word.rollbackChanges();
          res.status(400).send(error?.message);
        });
    });
  }

  edit(req: Request, res: Response) {
    const id: number = +req.params?.wid;
    const data = req.body as IEditWordDto;

    if (!EditWordValidator(data)) {
      return res.status(400).send(EditWordValidator.errors);
    }

    this.services.word.startTransaction().then(() => {
      this.services.word
        .getById(id, {})
        .then((result) => {
          if (result === null) {
            throw {
              status: 404,
              message: "The word is not found!",
            };
          }

          this.services.word
            .editById(id, {
              name: data.name,
            })
            .then(async (result) => {
              await this.services.word.commitChanges();
              res.send(result);
            })
            .catch(async (error) => {
              await this.services.word.rollbackChanges();
              res.status(400).send(error?.message);
            });
        })
        .catch((error) => {
          setTimeout(() => {
            res.status(error?.status ?? 500).send(error?.message);
          }, 500);
        });
    });
  }

  delete(req: Request, res: Response) {
    const id: number = +req.params?.wid;

    this.services.word.startTransaction().then(() => {
      this.services.word
        .getById(id, {})
        .then((result) => {
          if (result === null) {
            throw {
              status: 404,
              message: "The word is not found!",
            };
          }

          this.services.word
            .deleteById(id)
            .then(async (_result) => {
              await this.services.word.commitChanges();
              res.send("This word has been deleted!");
            })
            .catch(async (error) => {
              await this.services.word.rollbackChanges();
              res.status(500).send(error?.message);
            });
        })
        .catch((error) => {
          setTimeout(() => {
            res.status(error?.status ?? 500).send(error?.message);
          }, 500);
        });
    });
  }
}

export default WordController;
