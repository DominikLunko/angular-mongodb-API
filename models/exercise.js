import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
    bodyPart: {type: String },
    equipment: {type: String },
    gifUrl: {type: String },
    id: {type: Number, unique: true},
    name: {type: String },
    target: {type: String}
});

const Exercise = mongoose.model('exercises_list2', exerciseSchema);

export default Exercise;