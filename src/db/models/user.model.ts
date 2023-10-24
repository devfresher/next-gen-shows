import mongoose, { Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { User } from '../../types/user';
import { PaginateModel } from 'mongoose';

const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
	},
	lastName: {
		type: String,
	},
	fullName: {
		type: String,
	},
	stageName: {
		type: String,
	},
	talent: { type: Types.ObjectId, ref: 'Talent' },
	portfolio: { type: String },
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
	},
	isActive: {
		type: Boolean,
		default: true,
	},
	emailVerified: {
		type: Boolean,
		default: false,
	},
	isAdmin: { type: Boolean, default: false },
	isParticipant: { type: Boolean, default: false },
	isVoter: { type: Boolean, default: false },
	isOnboard: { type: Boolean, default: false },
	reason: String,
	phoneNumber: String,
	city: String,
	country: { type: Types.ObjectId, ref: 'Country' },
	passwordReset: {
		type: {
			token: String,
			expiry: Date,
			_id: false,
		},
	},
	profileImage: {
		type: {
			url: String,
			imageId: String,
			_id: false,
		},
	},
	createdAt: { type: Date, default: Date.now },
});

userSchema.plugin(paginate);
userSchema.pre('save', function (next) {
	this.fullName = `${this.firstName || ''} ${this.lastName || ''}`.trim();
	next();
});

interface UserModel extends PaginateModel<User, Document> {}

userSchema.plugin(paginate);
const UserModel = mongoose.model<User, UserModel>('User', userSchema);
export default UserModel;
