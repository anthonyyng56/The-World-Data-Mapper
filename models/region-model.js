const { model, Schema, ObjectId } = require('mongoose');

const regionSchema = new Schema(
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
        capital: {
            type: String,
            required: true
        },
        leader: {
            type: String,
            required: true
        },
        parentName: {
            type: String,
            required: true
        },
        path: {
            type: [ObjectId],
            required: true
        },
        landmarks: {
            type: [String],
            required: true
        },
        subregions: {
            type: [Region],
            required: true
        }
    },
    { timestamps: true }
);


const Region = model('Region', regionSchema);
module.exports = Region;