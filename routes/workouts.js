import express from 'express';

import Workout from '../models/workout.js';

import auth from '../middleware/auth.js';
// import { signin, signout, signup, refreshToken, updateUser, saveUserDailyCalory, getUserAnalytics } from '../controllers/user.js';

const router = express.Router();

const renameAttibutes = async(req, res) => {

    const nameChanges = {
        "Date": "date",
        "Workout Name": 'workoutName',
        'Exercise Name': 'exerciseName',
        'Set Order': 'setOrder',
        'Weight': 'weight',
        'Reps': 'reps',
        'Distance': 'distance',
        'Seconds': 'seconds',
        'Notes': 'notes',
        'Workout Notes': 'workoutNotes',
      };

    try {
        const renamed = await Workout.updateMany(
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
}

router.get('/rename-workout', renameAttibutes);

export default router;
