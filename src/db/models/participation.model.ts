import mongoose, { PaginateModel, Types } from 'mongoose';
import { Participation } from '../../types/participation';
import paginate from 'mongoose-paginate-v2';

const ParticipationSchema = new mongoose.Schema({
	user: { type: Types.ObjectId, ref: 'User', required: true },
	category: { type: Types.ObjectId, ref: 'Category', required: true },
	registeredData: { type: Object },
	multimedia: {
		type: {
			url: String,
			id: String,
			_id: false,
		},
	},
	status: { type: String, default: 'Joined' },
	paymentRef: { type: String },
	createdAt: { type: Date, default: Date.now },
});
interface ParticipationModel extends PaginateModel<Participation, Document> {}

ParticipationSchema.plugin(paginate);
const ParticipationModel = mongoose.model<Participation, ParticipationModel>(
	'Participation',
	ParticipationSchema
);
export default ParticipationModel;
