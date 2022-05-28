import BaseService from "../../common/BaseService";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import IAddUserDto from "./dto/IAddUser.dto";
import IEditUserDto from "./dto/IEditUser.dto";
import UserModel from "./UserModel.model";

export class UserAdapterOptions implements IAdapterOptions {
  removePassword: boolean;
  removeEmail: boolean;
}

export const DefaultUserAdapterOptions: UserAdapterOptions = {
  removePassword: false,
  removeEmail: false,
};

export default class UserService extends BaseService<
  UserModel,
  UserAdapterOptions
> {
  public tableName(): string {
    return "user";
  }

  protected async adaptToModel(
    data: any,
    options: UserAdapterOptions = DefaultUserAdapterOptions
  ): Promise<UserModel> {
    const user: UserModel = new UserModel();

    user.userId = +data?.user_id;
    user.username = data?.username;
    user.email = data?.email;
    user.passwordHash = data?.password_hash;
    user.createdAt = data?.created_at;
    user.updatedAt = data?.updated_at;
    user.isActive = +data?.is_active === 1;

    if (options.removePassword) {
      user.passwordHash = null;
    }

    if (options.removeEmail) {
      user.email = null;
    }

    return user;
  }

  public async add(data: IAddUserDto): Promise<UserModel> {
    return this.baseAdd(data, {
      removeEmail: true,
      removePassword: true,
    });
  }

  public async editById(
    wordId: number,
    data: IEditUserDto
  ): Promise<UserModel> {
    return this.baseEditById(wordId, data, DefaultUserAdapterOptions);
  }

  public async deleteById(id: number): Promise<true> {
    return this.baseDeleteById(id);
  }
}
