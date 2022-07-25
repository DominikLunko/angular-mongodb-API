import mongoose from "mongoose";

const bodyPartSchema = new mongoose.Schema({
    items: [{type: String}]
});

const bodyPart = mongoose.model('body_parts', bodyPartSchema);

export default bodyPart;