import Exercise from "../models/exercise.js";
import BodyPart from "../models/bodyPart.js";

/*
// GET EXERCISE GROUP WITH GROUP AND SLICE
export const getExerciseGroup = async (req, res) => {
  const { bodyPart, skip } = req.body;
  try {
    const exercisesData = await Exercise.aggregate([
      { $match: { bodyPart: { $eq: bodyPart } } },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            results: { $push: "$$CURRENT" },
          },
        },
        {
          $project: {
            count: 1,
            results: { $slice: ["$results", 0, 10] },
          },
        },
    ]);
    if (exercisesData[0]) {
      res.status(200).json({
        message: "Exercises fetch success",
        success: true,
        exercisesList: exercisesData[0]
      });
    } else {
      res.status(200).json({
        message: "No more data to fetch",
        success: false,
      });
    }
  } catch (error) {
    res.status(200).json({
      message: "Something went wrong",
      success: false,
    });
  }
};
*/


export const getExerciseGroup = async (req, res) => {
  const { bodyPart, skip } = req.body;
  try {
    const exercisesData = await Exercise.aggregate([
      {
        $facet: {
          metadata: [
            { $match: { bodyPart: { $eq: bodyPart } } },
            { $count: "total" }
        ],

          exercisesList: [
            { $match: { bodyPart: { $eq: bodyPart } } },
            { $skip: skip * 8},
            { $limit: 8 },
            {
              $project: {
                bodyPart: 1,
                equipment: 1,
                gifUrl: 1,
                name: 1,
                target: 1,
              },
            },
          ],
        },
      },
      { $sort: { name: 1 } },
    ]);
    if (exercisesData[0]?.exercisesList && exercisesData[0]?.metadata) {
      res.status(200).json({
        message: "Exercises fetch success",
        success: true,
        exercisesList: exercisesData[0].exercisesList,
        metadata: exercisesData[0].metadata
      });
    } else {
      res.status(200).json({
        message: "No more data to fetch",
        success: false,
      });
    }
  } catch (error) {
    res.status(200).json({
      message: "Something went wrong",
      success: false,
    });
  }
};
export const getAllBodyParts = async (req, res) => {
  try {
    const bodyParts = await BodyPart.find();
    res.status(200).json({
      message: "Body parts fetched",
      success: true,
      bodyParts: bodyParts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};
