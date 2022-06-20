import { Request } from "express";
import ITokenData from "../../src/components/auth/ITokenData";
declare global {
  namespace Express {
    interface Request {
      authorization: ITokenData | null;
    }
  }
}
