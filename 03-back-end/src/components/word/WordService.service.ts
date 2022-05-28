import WordModel from "./WordModel.model";
import { IAddWordDto } from "./dto/IAddWord.dto";
import BaseService from "../../common/BaseService";
import { IEditWordDto } from "./dto/IEditWord.dto";
import IAdapterOptions from "../../common/IAdapterOptions.interface";

export class WordAdapterOptions implements IAdapterOptions {}

class WordService extends BaseService<WordModel, WordAdapterOptions> {
  tableName(): string {
    return "word";
  }

  protected async adaptToModel(data: any): Promise<WordModel> {
    const word: WordModel = new WordModel();

    word.wordId = +data?.word_id;
    word.name = data?.name;

    return word;
  }

  public async getByName(name: string): Promise<WordModel> {
    return this.getByFieldNameAndValue("name", {}, name);
  }

  public async add(data: IAddWordDto): Promise<WordModel> {
    return this.baseAdd(data, {});
  }

  public async editById(
    wordId: number,
    data: IEditWordDto
  ): Promise<WordModel> {
    return this.baseEditById(wordId, data, {});
  }

  public async deleteById(id: number): Promise<true> {
    return this.baseDeleteById(id);
  }
}

export default WordService;
