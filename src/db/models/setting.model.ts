import mongoose, { PaginateModel, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { Setting } from '../../types/setting';
import { SchemaTypes } from 'mongoose';

const settingSchema = new mongoose.Schema({
	key: {
		type: String,
		required: true,
		unique: true,
	},
	value: {
		type: SchemaTypes.Mixed,
		required: true,
	},
	createdAt: { type: Date, default: Date.now },
});

interface SettingModel extends PaginateModel<Setting, Document> {}

settingSchema.plugin(paginate);
const SettingModel = mongoose.model<Setting, SettingModel>('Setting', settingSchema);
export default SettingModel;
