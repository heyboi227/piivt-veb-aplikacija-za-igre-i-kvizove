import CountryModel from "./CountryModel.model";
import BaseService from "../../common/BaseService";

class CountryService extends BaseService<CountryModel> {
  tableName(): string {
    return "country";
  }

  protected async adaptToModel(data: any): Promise<CountryModel> {
    const country: CountryModel = new CountryModel();

    country.countryId = +data?.country_id;
    country.countryCode = data?.country_code;
    country.name = data?.name;

    return country;
  }

  public async getAllByName(name: string): Promise<CountryModel[]> {
    return this.getAllByFieldNameAndValue("name", name);
  }

  public async getAllByCountryCode(
    countryCode: string
  ): Promise<CountryModel[]> {
    return this.getAllByFieldNameAndValue("country_code", countryCode);
  }
}

export default CountryService;
