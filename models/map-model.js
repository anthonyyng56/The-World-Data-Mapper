const { model, Schema, ObjectId } = require('mongoose');
const Map = require('./map-model').schema;

const mapSchema = new Schema(
    {
       _id: {
            type: ObjectId,
            required: true
        },
        id: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        owner: {
            type: String,
            required: true
        },
        subregions: {
            type: [Region],
            required: true
        }
    },
    { timestamps: true }
);


const Map = model('Map', mapSchema);
module.exports = Map;