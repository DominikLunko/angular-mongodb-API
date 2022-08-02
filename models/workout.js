import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema({
    date: {type: Date},
    workoutName: {type: String},
    exerciseName: {type: String},
    setOrder: {type: Number},
    weight: {type: Number},
    reps: {type: Number},
    distance: {type: Number},
    seconds: {type: Number},
    notes: {type: String},
    workoutNotes: {type: String}
});

const Workout = mongoose.model('workout_plans', workoutSchema);

export default Workout;
