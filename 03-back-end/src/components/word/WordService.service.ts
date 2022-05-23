import WordModel from "./WordModel.model";
import IAddWord from "./dto/IAddWord.dto";
import BaseService from "../../common/BaseService";
import { IEditWordDto } from "./dto/IEditWord.dto";

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
    return this.baseAdd(data);
  }

  public async editById(
    wordId: number,
    data: IEditWordDto
  ): Promise<WordModel> {
    return this.baseEditById(wordId, data);
  }
}

export default WordService;
