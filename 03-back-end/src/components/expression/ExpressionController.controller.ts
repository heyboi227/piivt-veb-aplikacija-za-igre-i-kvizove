import { Request, Response } from "express";
import BaseController from "../../common/BaseController";
import IAddExpressionDto, {
  AddExpressionValidator,
} from "./dto/IAddExpression.dto";
import IEditExpressionDto, {
  EditExpressionValidator,
} from "./dto/IEditExpression.dto";
class ExpressionController extends BaseController {
  getAll(_req: Request, res: Response) {
    this.services.expression
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
    const id: number = +req.params?.eid;

    this.services.expression
      .getById(id, {})
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "The expression is not found!",
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

  getAllByExpressionValue(req: Request, res: Response) {
    const expressionValue: string = req.params?.evalue;

    this.services.expression
      .getAllByExpressionValue(expressionValue)
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "The expression is not found!",
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
    const data = req.body as IAddExpressionDto;

    if (!AddExpressionValidator(data)) {
      return res.status(400).send(AddExpressionValidator.errors);
    }

    this.services.expression.startTransaction().then(() => {
      this.services.expression
        .add(data)
        .then(async (result) => {
          await this.services.expression.commitChanges();
          res.send(result);
        })
        .catch(async (error) => {
          await this.services.expression.rollbackChanges();
          res.status(400).send(error?.message);
        });
    });
  }

  edit(req: Request, res: Response) {
    const id: number = +req.params?.eid;
    const data = req.body as IEditExpressionDto;

    if (!EditExpressionValidator(data)) {
      return res.status(400).send(EditExpressionValidator.errors);
    }

    this.services.expression.startTransaction().then(() => {
      this.services.expression
        .getById(id, {})
        .then((result) => {
          if (result === null) {
            throw {
              status: 404,
              message: "The expression is not found!",
            };
          }

          this.services.expression
            .editById(id, {
              value: data.value,
            })
            .then(async (result) => {
              await this.services.expression.commitChanges();
              res.send(result);
            })
            .catch(async (error) => {
              await this.services.expression.rollbackChanges();
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
}

export default ExpressionController;
