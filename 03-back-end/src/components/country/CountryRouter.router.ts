import CountryController from "./CountryController.controller";
import CountryService from "./CountryService.service";
import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";

class CountryRouter implements IRouter {
  setupRoutes(
    application: express.Application,
    resources: IApplicationResources
  ) {
    const countryController: CountryController = new CountryController(
      resources.services
    );

    application.get(
      "/api/country",
      countryController.getAll.bind(countryController)
    );
    application.get(
      "/api/country/:cid",
      countryController.getById.bind(countryController)
    );
    application.get(
      "/api/country/code/:ccode",
      countryController.getAllByCountryCode.bind(countryController)
    );
    application.get(
      "/api/country/name/:cname",
      countryController.getAllByName.bind(countryController)
    );
  }
}

export default CountryRouter;
