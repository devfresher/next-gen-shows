import mongoose, { PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { Talent } from '../../types/talent';

const talentSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	label: {
		type: String,
		required: true,
		unique: true,
	},
	description: {
		type: String,
		required: true,
	},
	createdAt: { type: Date, default: Date.now },
});

interface TalentModel extends PaginateModel<Talent, Document> {}

talentSchema.plugin(paginate);
const TalentModel = mongoose.model<Talent, TalentModel>('Talent', talentSchema);
export default TalentModel;
