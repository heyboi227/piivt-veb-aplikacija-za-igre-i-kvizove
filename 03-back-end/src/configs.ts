import IConfig from "./common/IConfig.interface";
import GameRouter from "./components/game/GameRouter.router";
import UserRouter from "./components/user/UserRouter.router";
import { MailConfigurationParameters } from "./config.mail";
import { readFileSync } from "fs";
import QuestionRouter from "./components/question/QuestionRouter.router";

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
    new UserRouter(),
    new QuestionRouter(),
  ],
  mail: {
    host: "smtp.office365.com",
    port: 587,
    email: "",
    password: "",
    debug: true,
  },
  auth: {
    user: {
      algorithm: "RS256",
      issuer: "PIiVT",
      tokens: {
        auth: {
          duration: 60 * 60 * 24,
          keys: {
            public: readFileSync("./.keystore/app.public", "ascii"),
            private: readFileSync("./.keystore/app.private", "ascii"),
          },
        },
        refresh: {
          duration: 60 * 60 * 24 * 60,
          keys: {
            public: readFileSync("./.keystore/app.public", "ascii"),
            private: readFileSync("./.keystore/app.private", "ascii"),
          },
        },
      },
    },
    activeUser: {
      algorithm: "RS256",
      issuer: "PIiVT",
      tokens: {
        auth: {
          duration: 60 * 60 * 24,
          keys: {
            public: readFileSync("./.keystore/app.public", "ascii"),
            private: readFileSync("./.keystore/app.private", "ascii"),
          },
        },
        refresh: {
          duration: 60 * 60 * 24 * 60,
          keys: {
            public: readFileSync("./.keystore/app.public", "ascii"),
            private: readFileSync("./.keystore/app.private", "ascii"),
          },
        },
      },
    },
    allowAllRoutesWithoutAuthTokens: true,
  },
};

DevConfig.mail = MailConfigurationParameters;

export { DevConfig };
