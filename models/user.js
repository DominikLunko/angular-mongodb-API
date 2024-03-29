import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    age: {type: Number},
    weight: {type: Number},
    height: {type: Number},
    gender: {type: String},
    activity_level: { type: String },
});

const User = mongoose.model('User', userSchema);

export default User;
