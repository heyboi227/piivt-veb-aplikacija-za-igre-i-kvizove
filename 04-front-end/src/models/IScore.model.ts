import IUser from "./IUser.model";

export default interface IScore {
  scoreId: number;
  userId: number;
  value: number;

  createdAt: string;

  user: IUser;
}
