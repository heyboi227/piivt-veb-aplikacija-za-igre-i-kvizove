import BaseService from "../../common/BaseService";
import IAddUserDto from "./dto/IAddUser.dto";
import IEditUserDto from "./dto/IEditUser.dto";
import UserModel from "./UserModel.model";

export default class UserService extends BaseService<UserModel> {
  public tableName(): string {
    return "user";
  }

  protected async adaptToModel(data: any): Promise<UserModel> {
    const user: UserModel = new UserModel();

    user.userId = +data?.user_id;
    user.username = data?.username;
    user.email = data?.email;
    user.passwordHash = data?.password_hash;
    user.createdAt = data?.created_at;
    user.updatedAt = data?.updated_at;
    user.isActive = +data?.is_active === 1;

    return user;
  }

  public async getAllByName(name: string): Promise<UserModel[]> {
    return this.getAllByFieldNameAndValue("name", name);
  }

  public async add(data: IAddUserDto): Promise<UserModel> {
    return this.baseAdd(data);
  }

  public async editById(
    wordId: number,
    data: IEditUserDto
  ): Promise<UserModel> {
    return this.baseEditById(wordId, data);
  }

  public async deleteById(id: number): Promise<true> {
    return this.baseDeleteById(id);
  }
}
