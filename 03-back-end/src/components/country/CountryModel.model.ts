import IModel from "../../common/IModel.interface";
class CountryModel implements IModel {
  countryId: number;
  countryCode: string;
  name: string;
}

export default CountryModel;
