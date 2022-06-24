import { IMailConfiguration } from "./common/IConfig.interface";
const MailConfigurationParameters: IMailConfiguration = {
  host: "ENTER YOUR HOST HERE",
  port: 587,
  email: "ENTER YOUR EMAIL HERE",
  password:
    "ENTER YOUR PASSWORD HERE (Go to https://myaccount.google.com/apppasswords if Gmail password for host doesn't work)",
  debug: true,
};

export { MailConfigurationParameters };
