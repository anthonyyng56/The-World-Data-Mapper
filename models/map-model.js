const { model, Schema, ObjectId } = require('mongoose');

const mapSchema = new Schema(
	{
		_id: {
			type: ObjectId,
			required: true
		},
		owner: {
			type: String,
			required: true
		},
		name: {
			type: String,
			required: true
		},
		capital: {
			type: String,
			required: true
		},
		leader: {
			type: String,
			required: true
		},
		landmarks: {
			type: [String],
			required: true
		},
		subregions_id: {
			type: [String],
			required: true
		},
		ancestors_id: {
			type: [String],
			required: true
		},
		ancestors: {
			type: [String],
			required: true
		},
		root: {
			type: String,
			required: true
		}
	},
	{ timestamps: true }
);

const Map = model('Map', mapSchema);
module.exports = Map;