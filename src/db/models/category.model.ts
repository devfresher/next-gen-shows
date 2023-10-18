import mongoose, { PaginateModel, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { Category } from '../../types/category';

const categorySchema = new mongoose.Schema({
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
	event: {
		type: Types.ObjectId,
		ref: 'Event',
		required: true,
	},
	talent: {
		type: Types.ObjectId,
		ref: 'Talent',
		required: true,
	},
	country: {
		type: Types.ObjectId,
		ref: 'Country',
		required: true,
	},
	createdAt: { type: Date, default: Date.now },
});

interface CategoryModel extends PaginateModel<Category, Document> {}

categorySchema.plugin(paginate);
const CategoryModel = mongoose.model<Category, CategoryModel>('Category', categorySchema);
export default CategoryModel;
