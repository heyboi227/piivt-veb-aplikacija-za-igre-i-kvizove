import WordService from "./WordService.service";
import { Request, Response } from "express";
import { AddWordValidator, IAddWordDto } from "./dto/IAddWord.dto";
import { EditWordValidator, IEditWordDto } from "./dto/IEditWord.dto";
class WordController {
  private wordService: WordService;

  constructor(wordService: WordService) {
    this.wordService = wordService;
  }

  async getAll(_req: Request, res: Response) {
    this.wordService
      .getAll()
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  async getById(req: Request, res: Response) {
    const id: number = +req.params?.id;

    this.wordService
      .getById(id)
      .then((result) => {
        if (result === null) {
          return res.sendStatus(404);
        }

        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  async getAllByName(req: Request, res: Response) {
    const name: string = req.params?.name;

    this.wordService
      .getAllByName(name)
      .then((result) => {
        if (result === null) {
          return res.sendStatus(404);
        }

        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  async add(req: Request, res: Response) {
    const data = req.body as IAddWordDto;

    if (!AddWordValidator(data)) {
      return res.status(400).send(AddWordValidator.errors);
    }

    this.wordService
      .add(data)
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(400).send(error?.message);
      });
  }

  async edit(req: Request, res: Response) {
    const id: number = +req.params?.id;
    const data = req.body as IEditWordDto;

    if (!EditWordValidator(data)) {
      return res.status(400).send(EditWordValidator.errors);
    }

    this.wordService
      .getById(id)
      .then((result) => {
        if (result === null) {
          return res.sendStatus(404);
        }

        this.wordService
          .editById(id, {
            name: data.name,
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
    const id: number = +req.params?.id;

    this.wordService
      .getById(id)
      .then((result) => {
        if (result === null) {
          return res.sendStatus(404);
        }

        this.wordService
          .deleteById(id)
          .then((result) => {
            res.send("This word has been deleted!");
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

export default WordController;
