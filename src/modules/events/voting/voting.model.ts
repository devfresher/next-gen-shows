import mongoose, { PaginateModel, Types } from 'mongoose';
import { Voting } from '../../../types/voting';
import paginate from 'mongoose-paginate-v2';

const VotingSchema = new mongoose.Schema({
	voter: { type: Types.ObjectId, ref: 'User', required: true },
	event: { type: Types.ObjectId, ref: 'Event', required: true },
	participant: { type: Types.ObjectId, ref: 'User', required: true },
	votes: { type: Number, required: true },
	paymentRef: { type: String },
	createdAt: { type: Date, default: Date.now },
});

interface VotingModel extends PaginateModel<Voting, Document> {}

VotingSchema.plugin(paginate);
const VotingModel = mongoose.model<Voting, VotingModel>('Voting', VotingSchema);
export default VotingModel;


