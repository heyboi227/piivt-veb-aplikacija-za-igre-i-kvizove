import { Request, Response } from "express";
import BaseController from "../../common/BaseController";
import { IQuestionAnswerDto } from "../question/dto/IAddQuestion.dto";
import { DefaultAnswerAdapterOptions } from "./AnswerService.service";

export default class AnswerController extends BaseController {
  getAll(req: Request, res: Response) {
    this.services.answer
      .getAll(DefaultAnswerAdapterOptions)
      .then((result) => {
        res.send(result);
      })
      .catch((error: { message: any }) => {
        setTimeout(() => {
          res.status(500).send(error?.message);
        }, 500);
      });
  }

  getById(req: Request, res: Response) {
    const id: number = +req.params?.aid;

    this.services.answer
      .getById(id, DefaultAnswerAdapterOptions)
      .then((result) => {
        if (result === null) {
          res.status(404).send("Answer not found!");
        }

        res.send(result);
      })
      .catch((error) => {
        setTimeout(() => {
          res.status(500).send(error?.message);
        }, 500);
      });
  }
}
