import WordModel from "./WordModel.model";
import IAddWord from "./dto/IAddWord.dto";
import BaseService from "../../common/BaseService";

class WordService extends BaseService<WordModel> {
  tableName(): string {
    return "word";
  }

  protected async adaptToModel(data: any): Promise<WordModel> {
    const word: WordModel = new WordModel();

    word.wordId = +data?.word_id;
    word.name = data?.name;

    return word;
  }

  public async getAllByName(name: string): Promise<WordModel[]> {
    return this.getAllByFieldNameAndValue("name", name);
  }

  public async add(data: IAddWord): Promise<WordModel> {
    return new Promise<WordModel>((resolve, reject) => {
      const sql: string = "INSERT `word` SET `name` = ?;";

      this.db
        .execute(sql, [data.name])
        .then(async (result) => {
          const info: any = result;

          const newWordId = +info[0].insertId;

          const newWord: WordModel | null = await this.getById(newWordId);

          if (newWord === null) {
            return reject({
              message: "Duplicate word name!",
            });
          }

          resolve(newWord);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

export default WordService;
