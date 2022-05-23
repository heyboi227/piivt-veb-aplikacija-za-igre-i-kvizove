import * as mysql2 from "mysql2/promise";
import IModel from "./IModel.interface";
import IServiceData from "./IServiceData.interface";

export default abstract class BaseService<ReturnModel extends IModel> {
  private database: mysql2.Connection;

  constructor(databaseConnection: mysql2.Connection) {
    this.database = databaseConnection;
  }

  protected get db(): mysql2.Connection {
    return this.database;
  }

  public abstract tableName(): string;

  protected abstract adaptToModel(data: any): Promise<ReturnModel>;

  public async getById(id: number): Promise<ReturnModel | null> {
    const tableName = this.tableName();

    return new Promise<ReturnModel>((resolve, reject) => {
      const sql: string = `SELECT * FROM \`${tableName}\` WHERE \`${tableName}_id\` = ?;`;

      this.db
        .execute(sql, [id])
        .then(async ([rows]) => {
          if (rows === undefined) {
            return resolve(null);
          }

          if (Array.isArray(rows) && rows.length === 0) {
            return resolve(null);
          }

          resolve(await this.adaptToModel(rows[0]));
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async getAll(): Promise<ReturnModel[]> {
    const tableName = this.tableName();

    return new Promise<ReturnModel[]>((resolve, reject) => {
      const sql: string = `SELECT * FROM \`${tableName}\`;`;
      this.db
        .execute(sql)
        .then(async ([rows]) => {
          if (rows === undefined) {
            return resolve([]);
          }

          const items: ReturnModel[] = [];

          for (const row of rows as mysql2.RowDataPacket[]) {
            items.push(await this.adaptToModel(row));
          }

          resolve(items);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  protected async getAllByFieldNameAndValue(
    fieldName: string,
    value: any
  ): Promise<ReturnModel[]> {
    const tableName = this.tableName();

    return new Promise<ReturnModel[]>((resolve, reject) => {
      const sql: string = `SELECT * FROM \`${tableName}\` WHERE \`${fieldName}\` = ?;`;

      this.db
        .execute(sql, [value])
        .then(async ([rows]) => {
          if (rows === undefined) {
            return resolve([]);
          }

          const items: ReturnModel[] = [];

          for (const row of rows as mysql2.RowDataPacket[]) {
            items.push(await this.adaptToModel(row));
          }

          resolve(items);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  protected async baseAdd(data: IServiceData): Promise<ReturnModel> {
    const tableName = this.tableName();

    return new Promise((resolve, reject) => {
      const properties = Object.getOwnPropertyNames(data);
      const sqlPairs = properties
        .map((property) => "`" + property + "` = ?")
        .join(", ");
      const values = properties.map((property) => data[property]);

      const sql: string = "INSERT `" + tableName + "` SET " + sqlPairs + ";";

      this.db
        .execute(sql, values)
        .then(async (result) => {
          const info: any = result;

          const newItemId = +info[0].insertId;

          const newItem: ReturnModel | null = await this.getById(newItemId);

          if (newItem === null) {
            return reject({
              message:
                "Could not add a new item into the " + tableName + " table!",
            });
          }

          resolve(newItem);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  protected async baseEditById(
    id: number,
    data: IServiceData
  ): Promise<ReturnModel> {
    const tableName = this.tableName();

    return new Promise((resolve, reject) => {
      const properties = Object.getOwnPropertyNames(data);

      const sqlPairs = properties
        .map((property) => "`" + property + "` = ?")
        .join(", ");
      const values = properties.map((property) => data[property]);
      values.push(id);

      const sql: string =
        "UPDATE `" +
        tableName +
        "` SET " +
        sqlPairs +
        " WHERE `" +
        tableName +
        "_id` = ?;";

      this.db
        .execute(sql, values)
        .then(async (result) => {
          const info: any = result;

          if (info[0]?.affectedRows === 0) {
            return reject({
              message:
                "Could not change any items in the " + tableName + " table!",
            });
          }

          const item: ReturnModel | null = await this.getById(id);

          if (item === null) {
            return reject({
              message:
                "Could not find this item in the " + tableName + " table!",
            });
          }

          resolve(item);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  protected async baseDeleteById(id: number): Promise<true> {
    const tableName = this.tableName();

    return new Promise((resolve, reject) => {
      const sql: string = `DELETE FROM \`${tableName}\` WHERE \`${tableName}_id\` = ?;`;

      this.db
        .execute(sql, [id])
        .then(async (result) => {
          const info: any = result;

          if (info[0]?.affectedRows === 0) {
            return reject({
              message: "Could not delete items in the " + tableName + " table!",
            });
          }

          resolve(true);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
