import mongoose from "mongoose";

const nutrientsSchema = new mongoose.Schema({
  category: {type: String},
  carbs: {type: Number},
  fiber: {type: Number},
  sat: {
    fat: {type: Number}
  },
  fat: {type: Number},
  protein: {type: Number},
  calories: {type: Number},
  grams: {type: Number},
  measure: {type: String},
  food: {type: String}
});

const Nutrient = mongoose.model('nutrients', nutrientsSchema);

export default Nutrient;