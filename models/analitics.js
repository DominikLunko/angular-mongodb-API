import mongoose from "mongoose";

import Workout from "./workout.js";

const userAnalyticsSchema = new mongoose.Schema({
  userId: { type: String },
  ideal_weight: { type: String },
  bmr: { type: String },
  bmi: { type: Number },
  health: { type: String },
  daily_calory_intake: [
    {
      date: { type: Date },
      calories: { type: Number },
    },
  ],
  healthy_bmi_range: { type: String },
  favourite_nutrients: {
    type: [mongoose.Schema.ObjectId],
    default: [],
  },
  workout_plans: {
    type: [
      {
        workoutDays: [],
        uniqueId: String,
        title: String,
      },
    ],
    default: [],
  },
  weight_goals: {
    extreme_weight_gain: {
      calory: { type: Number },
      weight: { type: String },
    },
    extreme_weight_loss: {
      calory: { type: Number },
      weight: { type: String },
    },
    mild_weight_loss: {
      calory: { type: Number },
      weight: { type: String },
    },
    mild_weight_gain: {
      calory: { type: Number },
      weight: { type: String },
    },
    weight_loss: {
      calory: { type: Number },
      weight: { type: String },
    },
    weight_gain: {
      calory: { type: Number },
      weight: { type: String },
    },
    maintain_weight: { type: Number },
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const User_analytics = mongoose.model("User_analytics", userAnalyticsSchema);

export default User_analytics;
