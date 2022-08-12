import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User_analytics from "../models/analitics.js";
import Nutrient from "../models/nutrients.js";
import User from "../models/user.js";

// AUTH

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser)
      return res.status(200).json({
        message: "User doesn't exist",
        success: false,
      });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect)
      return res.status(200).json({
        message: "Invalid credetnials.",
        success: false,
      });

    const token = jwt.sign({ _id: existingUser._id }, "test", {
      expiresIn: "1h",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.status(200).json({
      success: true,
      message: "Login success",
      result: existingUser,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signup = async (req, res) => {
  const { email, password, firstName, lastName, confirmPassword } = req.body;
  console.log(req.body);

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(200).json({
        message: "User already exists",
        success: false,
      });

    if (password !== confirmPassword)
      return res.status(200).json({
        message: "Passwords dont match.",
        success: false,
      });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });
    console.log(result)
    const newAnalytics = new User_analytics({ userId: result._id });
    console.log(newAnalytics);
    await newAnalytics.save();

    // const {password, ...data} = await result.toJSON();

    const token = jwt.sign({ _id: result._id }, "test", { expiresIn: "1h" });

    console.log(result);
    res.status(200).json({
      result: result,
      token: token,
      success: true,
      message: "Registration success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });

    res.send({
      success: true,
      message: "Logged out successfully!",
    });
  } catch (err) {
    console.log(err);
    res.send({
      success: false,
      message: "Something went wrong!",
    });
  }
};
export const refreshToken = async (req, res) => {
  const userId = req.userId;
  try {
    const existingUser = await User.findOne({ _id: userId });

    if (!existingUser)
      res.status(200).send({
        success: false,
        message: "Refresh error",
      });
    res.status(200).send({
      success: true,
      message: "Refresh success",
      user: existingUser,
    });
  } catch (err) {
    console.log(err);
    res.send({
      success: false,
      message: "Something went wrong!",
    });
  }
};

// USER PERSONAL DATA CONTROLLERS

export const updateUser = async (req, res) => {
  const userId = req.userId;
  const user = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(200).send({
        success: false,
        message: "No user with that ID",
      });
    }
    const updatedUser = await User.findByIdAndUpdate(userId, user, {
      new: true,
    });
    res.status(200).send({
      success: true,
      message: "User successfully updated",
      updatedUser,
    });
  } catch (err) {
    console.log(err);
    res.send({
      success: false,
      message: "Something went wrong!",
    });
  }
};

export const getUserAnalytics = async (req, res) => {
  try {
    /*
    const analytics = await User_analytics.find({ userId: req.userId });
    const nutrients = await Nutrient.find({
      _id: { $in: analytics[0].favourite_nutrients },
    });
    */
    const analytics = await User_analytics.aggregate([
      {
        $match: { userId: req.userId },
      },
      {
        $lookup: {
          from: "nutrients",
          localField: "favourite_nutrients",
          foreignField: "_id",
          as: "joined_favourite_nutrients",
        },
      },
      {
        $project: {
          ideal_weight: 1,
          bmr: 1,
          bmi: 1,
          health: 1,
          daily_calory_intake: 1,
          workout_plans: 1,
          healthy_bmi_range: 1,
          weight_goals: 1,
          createdAt: 1,
          joined_favourite_nutrients: {
            food: 1,
            _id: 1,
          },
        },
      },
    ]);
    if (analytics.length < 1) {
      return res.status(200).send({
        success: false,
        message: "No analytics with that userID",
      });
    } else {
      res.status(200).send({
        success: true,
        message: "Analytics fetched successfully",
        analytics: analytics,
      });
    }
  } catch (err) {
    console.log(err);
    res.send({
      success: false,
      message: "Something went wrong!",
    });
  }
};

export const saveAnalytics = async (req, res) => {
  let user_analytics = req.body;
  user_analytics.userId = req.userId;
  user_analytics.createdAt = new Date().toISOString();
  try {
    const updatedAnalytics = await User_analytics.updateOne(
      { userId: req.userId },
      user_analytics
    );
    res.status(200).send({
      success: true,
      message: "User analytics successfully updated",
      updatedAnalytics,
    });
  } catch (err) {
    console.log(err);
    res.send({
      success: false,
      message: "Something went wrong!",
    });
  }
};
export const addToFavourite = async (req, res) => {
  const { nutrientId } = req.params;

  const userAnalytics = await User_analytics.find({ userId: req.userId });

  let favouriteNutrients = [];

  if (userAnalytics[0].favourite_nutrients.length > 0) {
    favouriteNutrients = userAnalytics[0].favourite_nutrients;
  }
  const index = favouriteNutrients.indexOf(mongoose.Types.ObjectId(nutrientId));

  if (index == -1) {
    favouriteNutrients.push(nutrientId);
  } else {
    favouriteNutrients = favouriteNutrients.filter(
      (id) => String(id) != nutrientId
    );
  }
  const updatedUserAnalytics = await User_analytics.updateOne(
    { userId: req.userId },
    { favourite_nutrients: favouriteNutrients }
  );

  if (updatedUserAnalytics) {
    res.status(200).json({
      success: true,
      message: "Favourite updated successfully!",
      favouriteNutrientList: favouriteNutrients,
    });
  } else {
    res.status(200).json({
      success: false,
      message: "Favourite updated failed!",
    });
  }
};

export const addToDailyCaloryIntake = async (req, res) => {
  const { calories, todayDate } = req.body;
  // const checkTodayDate = new Date().toISOString().split("T")[0];
  try {
    const analytics = await User_analytics.find({ userId: req.userId });
    let dailyCaloryIntake = [];
    if (analytics[0].daily_calory_intake.length > 0) {
      dailyCaloryIntake = analytics[0].daily_calory_intake;
    }
    let todayDailyCalories = dailyCaloryIntake.find(
      (item) => item.date.toISOString().split("T")[0] == todayDate.split("T")[0]
    );
    if (todayDailyCalories) {
      todayDailyCalories.calories = todayDailyCalories.calories + calories;
    } else {
      dailyCaloryIntake.push({
        date: todayDate.split("T")[0],
        calories: calories,
      });
    }
    const updatedUserAnalytics = await User_analytics.updateOne(
      { userId: req.userId },
      { daily_calory_intake: dailyCaloryIntake }
    );
    if (updatedUserAnalytics) {
      res.status(200).json({
        success: true,
        message: "Daily intake updated successfully!",
      });
    } else {
      res.status(200).json({
        success: false,
        message: "Daily intake updated failed!",
      });
    }
  } catch (err) {
    console.log(err);
    res.send({
      success: false,
      message: "Something went wrong!",
    });
  }
};

export const saveWorkoutPlan = async (req, res) => {
  const { workout } = req.body;
  try {
     const result = await User_analytics.aggregate([
      {$match: {userId: req.userId}},
      {$project: {
        _id: 0,
        workout_plans: 1
      }}
     ])
     let workoutPlans = result[0].workout_plans
     const index = workoutPlans.findIndex(item => item.uniqueId == workout.uniqueId);
      if (index == -1) {
        workoutPlans.push(workout);
      } else {
        workoutPlans[index] = JSON.parse(JSON.stringify(workout));
      }
     await User_analytics.updateOne(
      { userId: req.userId },
      {workout_plans: workoutPlans}
    );
  
    res.status(200).json({
      success: true,
      message: "Workout saved successfully!",
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteWorkoutPlan = async (req, res) => {
  const { workoutId } = req.params;
  console.log(workoutId);

  const updatedUserAnalytics = await User_analytics.updateOne(
    { userId: req.userId },
    { $pull: { workout_plans: { uniqueId: workoutId } } }
  );

  if (updatedUserAnalytics) {
    res.status(200).json({
      success: true,
      message: "Workout deleted successfully!",
    });
  } else {
    res.status(200).json({
      success: false,
      message: "Workout delete failed!",
    });
  }
};

