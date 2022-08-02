import { MongoClient } from "mongodb";
import Nutrient from "../models/nutrients.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await Nutrient.find().distinct("category");
    res.status(200).json({
      message: "Categories of nutrients fetched",
      success: true,
      categories: categories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};

export const getNutritions = async (req, res) => {
  const { macros, foodName, skip, categories } = req.body;
  // search word
  let modifiedLetter = foodName.toLowerCase();
  modifiedLetter =
    modifiedLetter.charAt(0).toUpperCase() + modifiedLetter.slice(1);
  var keywords = [
    foodName,
    foodName.toLocaleLowerCase(),
    foodName.toLocaleUpperCase(),
    modifiedLetter,
    foodName.toLowerCase(),
    foodName.toUpperCase(),
  ];
  let regex = keywords.join("|");
  try {
    const foundFoods = await Nutrient.aggregate([
      {
        $facet: {
          metadata: [
            {
              $match: {
                $and: [{ food: { $regex: regex } }, { 'category' : { $exists: true, $in: categories}}],
              },
            },
            { $count: "total" },
          ],
          nutritionList: [
            {
              $match: {
                $and: [{ food: { $regex: regex } }, { 'category' : { $exists: true, $in: categories}}],
              },
            },
            { $skip: skip * 12 },
            { $limit: 12 },
            {
              $project: {
                protein: {
                  $cond: {
                    if: { $eq: [false, macros.protein] },
                    then: "$$REMOVE",
                    else: "$protein",
                  },
                },
                carbs: {
                  $cond: {
                    if: { $eq: [false, macros.carbohydrate] },
                    then: "$$REMOVE",
                    else: "$carbs",
                  },
                },
                fat: {
                  $cond: {
                    if: { $eq: [false, macros.fat] },
                    then: "$$REMOVE",
                    else: "$fat",
                  },
                },
                fiber: {
                  $cond: {
                    if: { $eq: [false, macros.fiber] },
                    then: "$$REMOVE",
                    else: "$fiber",
                  },
                },
                calories: 1,
                food: 1,
                grams: 1,
                measure: 1,
                category: 1,
              },
            },
          ],
        },
      },
    ]);
    if (foundFoods[0]?.nutritionList && foundFoods[0]?.metadata) {
      res.status(200).json({
        message: "Nutrients fetch success",
        success: true,
        nutrients: foundFoods[0].nutritionList,
        metadata: foundFoods[0].metadata,
      });
    } else {
      res.status(200).json({
        message: "No more data to fetch",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(200).json({
      message: error.message,
      success: false,
    });
  }
};

/*
try {
    const nameChanges = {
    };
    const renamed = await Nutrient.updateMany(
        {},
        { $rename: nameChanges },
        {
          // Strict allows to update keys that do not exist anymore in the schema
          strict: false,
        }
      ).exec();
    res.send({
        success: true,
        message: 'success'
    })
  }catch(err) {
    res.send({
        success: false,
        message: err.message
    })
  }
*/
