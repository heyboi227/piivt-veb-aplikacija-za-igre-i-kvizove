import CountryModel from "./CountryModel.model";
import BaseService from "../../common/BaseService";
import IAdapterOptions from "../../common/IAdapterOptions.interface";

export class CountryAdapterOptions implements IAdapterOptions {
  removeCountryCode: boolean;
}

export const DefaultCountryAdapterOptions: CountryAdapterOptions = {
  removeCountryCode: false,
};

class CountryService extends BaseService<CountryModel, CountryAdapterOptions> {
  tableName(): string {
    return "country";
  }

  protected async adaptToModel(
    data: any,
    options: CountryAdapterOptions = DefaultCountryAdapterOptions
  ): Promise<CountryModel> {
    const country: CountryModel = new CountryModel();

    country.countryId = +data?.country_id;
    country.countryCode = data?.country_code;
    country.name = data?.name;

    if (options.removeCountryCode) {
      country.countryCode = null;
    }

    return country;
  }

  public async getByName(name: string): Promise<CountryModel> {
    return this.getByFieldNameAndValue(
      "name",
      {
        removeCountryCode: true,
      },
      name
    );
  }

  public async getByCountryCode(
    countryCode: string
  ): Promise<CountryModel> {
    return this.getByFieldNameAndValue(
      "country_code",
      DefaultCountryAdapterOptions,
      countryCode
    );
  }
}

export default CountryService;
