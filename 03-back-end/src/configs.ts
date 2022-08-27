import IConfig from "./common/IConfig.interface";
import GameRouter from "./components/game/GameRouter.router";
import UserRouter from "./components/user/UserRouter.router";
import { MailConfigurationParameters } from "./config.mail";
import { readFileSync } from "fs";
import QuestionRouter from "./components/question/QuestionRouter.router";
import AnswerRouter from "./components/answer/AnswerRouter.router";
import AuthRouter from "./components/auth/AuthRouter.router";
import AdministratorRouter from "./components/administrator/AdministratorRouter.router";
import "dotenv/config";
import ScoreRouter from "./components/score/ScoreRouter.router";

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
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: "piivt_app",
    charset: "utf8",
    timezone: "+01:00",
    supportBigNumbers: true,
  },
  routers: [
    new AnswerRouter(),
    new AuthRouter(),
    new AdministratorRouter(),
    new GameRouter(),
    new QuestionRouter(),
    new ScoreRouter(),
    new UserRouter(),
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
    administrator: {
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
    allowAllRoutesWithoutAuthTokens: false,
  },
};

DevConfig.mail = MailConfigurationParameters;

export { DevConfig };
