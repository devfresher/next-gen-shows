import mongoose, { PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { Country } from '../../types/country';

const countrySchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	label: {
		type: String,
		required: true,
		unique: true,
	},
	continent: {
		type: String,
		required: true,
	},
	createdAt: { type: Date, default: Date.now },
});

interface CountryModel extends PaginateModel<Country, Document> {}

countrySchema.plugin(paginate);
const CountryModel = mongoose.model<Country, CountryModel>('Country', countrySchema);
export default CountryModel;
