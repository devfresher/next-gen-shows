import winston from 'winston';
import CountryService from '../../modules/country/country.service';
import CountryModel from '../models/country.model';

const countries = [
	{ name: 'Algeria', continent: 'Africa' },
	{ name: 'Angola', continent: 'Africa' },
	{ name: 'Benin', continent: 'Africa' },
	{ name: 'Botswana', continent: 'Africa' },
	{ name: 'Burkina Faso', continent: 'Africa' },
	{ name: 'Burundi', continent: 'Africa' },
	{ name: 'Cabo Verde', continent: 'Africa' },
	{ name: 'Cameroon', continent: 'Africa' },
	{ name: 'Central African Republic', continent: 'Africa' },
	{ name: 'Chad', continent: 'Africa' },
	{ name: 'Comoros', continent: 'Africa' },
	{ name: 'Congo (Congo-Brazzaville)', continent: 'Africa' },
	{ name: 'Democratic Republic of the Congo (Congo-Kinshasa)', continent: 'Africa' },
	{ name: 'Djibouti', continent: 'Africa' },
	{ name: 'Egypt', continent: 'Africa' },
	{ name: 'Equatorial Guinea', continent: 'Africa' },
	{ name: 'Eritrea', continent: 'Africa' },
	{ name: 'Eswatini', continent: 'Africa' },
	{ name: 'Ethiopia', continent: 'Africa' },
	{ name: 'Gabon', continent: 'Africa' },
	{ name: 'Gambia', continent: 'Africa' },
	{ name: 'Ghana', continent: 'Africa' },
	{ name: 'Guinea', continent: 'Africa' },
	{ name: 'Guinea-Bissau', continent: 'Africa' },
	{ name: 'Ivory Coast', continent: 'Africa' },
	{ name: 'Kenya', continent: 'Africa' },
	{ name: 'Lesotho', continent: 'Africa' },
	{ name: 'Liberia', continent: 'Africa' },
	{ name: 'Libya', continent: 'Africa' },
	{ name: 'Madagascar', continent: 'Africa' },
	{ name: 'Malawi', continent: 'Africa' },
	{ name: 'Mali', continent: 'Africa' },
	{ name: 'Mauritania', continent: 'Africa' },
	{ name: 'Mauritius', continent: 'Africa' },
	{ name: 'Morocco', continent: 'Africa' },
	{ name: 'Mozambique', continent: 'Africa' },
	{ name: 'Namibia', continent: 'Africa' },
	{ name: 'Niger', continent: 'Africa' },
	{ name: 'Nigeria', continent: 'Africa' },
	{ name: 'Rwanda', continent: 'Africa' },
	{ name: 'Sao Tome and Principe', continent: 'Africa' },
	{ name: 'Senegal', continent: 'Africa' },
	{ name: 'Seychelles', continent: 'Africa' },
	{ name: 'Sierra Leone', continent: 'Africa' },
	{ name: 'Somalia', continent: 'Africa' },
	{ name: 'South Africa', continent: 'Africa' },
	{ name: 'South Sudan', continent: 'Africa' },
	{ name: 'Sudan', continent: 'Africa' },
	{ name: 'Tanzania', continent: 'Africa' },
	{ name: 'Togo', continent: 'Africa' },
	{ name: 'Tunisia', continent: 'Africa' },
	{ name: 'Uganda', continent: 'Africa' },
	{ name: 'Zambia', continent: 'Africa' },
	{ name: 'Zimbabwe', continent: 'Africa' },
];

class Migration {
	run = async () => {
		CountryModel.deleteMany({});

		countries.map((country) => {
			CountryService.create(country);
			winston.info(`Country ${country.name} created`);
		});
	};
}

export default new Migration();
