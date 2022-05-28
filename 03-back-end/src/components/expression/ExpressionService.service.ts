import BaseService from "../../common/BaseService";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import { IAddExpressionDto } from "./dto/IAddExpression.dto";
import { IEditExpressionDto } from "./dto/IEditExpression.dto";
import ExpressionModel from "./ExpressionModel.model";

export class ExpressionAdapterOptions implements IAdapterOptions {}

class ExpressionService extends BaseService<
  ExpressionModel,
  ExpressionAdapterOptions
> {
  tableName(): string {
    return "expression";
  }

  protected async adaptToModel(data: any): Promise<ExpressionModel> {
    const expression: ExpressionModel = new ExpressionModel();

    expression.expressionId = +data?.expression_id;
    expression.value = data?.value;

    return expression;
  }

  public async getAllByExpressionValue(
    expressionValue: string
  ): Promise<ExpressionModel[]> {
    return this.getAllByFieldNameAndValue("value", expressionValue, {});
  }

  public async add(data: IAddExpressionDto): Promise<ExpressionModel> {
    return this.baseAdd(data, {});
  }

  public async editById(
    expressionId: number,
    data: IEditExpressionDto
  ): Promise<ExpressionModel> {
    return this.baseEditById(expressionId, data, {});
  }
}

export default ExpressionService;
