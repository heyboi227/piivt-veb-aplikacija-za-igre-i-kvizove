import IConfig from "./common/IConfig.interface";
import CountryRouter from "./components/country/CountryRouter.router";
import GameRouter from "./components/game/GameRouter.router";
import UserRouter from "./components/user/UserRouter.router";
import WordRouter from "./components/word/WordRouter.router";
import ExpressionRouter from "./components/expression/ExpressionRouter.router";
import { MailConfigurationParameters } from "./config.mail";

const DevConfig: IConfig = {
  server: {
    port: 10000,
    static: {
      index: false,
      dotfiles: "deny",
      cacheControl: true,
      etag: true,
      maxAge: 1000 * 60 * 60 * 24,
      path: "./static",
      route: "/assets",
    },
  },
  logging: {
    path: "./log-files",
    filename: "access.log",
    format:
      ":date[iso]\t:remote-addr\t:method\t:url\t:status\t:res[content-length] bytes\t:response-time ms",
  },
  database: {
    host: "localhost",
    port: 3306,
    user: "jeknicm",
    password: "jeknicm",
    database: "piivt_app",
    charset: "utf8",
    timezone: "+01:00",
    supportBigNumbers: true,
  },
  routers: [
    new GameRouter(),
    new WordRouter(),
    new UserRouter(),
    new CountryRouter(),
    new ExpressionRouter(),
  ],
  mail: {
    host: "smtp.office365.com",
    port: 587,
    email: "",
    password: "",
    debug: true,
  },
};

DevConfig.mail = MailConfigurationParameters;

export { DevConfig };
