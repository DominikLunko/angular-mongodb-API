import Workout from '../models/workout.js';

export const renameAttibutes = async(req, res) => {

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
        await Workout.updateMany(
            {},
            { $rename: nameChanges },
            {
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

export const getExercisesByName = async(req, res) => {
   const { exerciseName } = req.params;
   console.log(exerciseName);
    try {
        const exercises = await Workout.find({exerciseName: {$regex: exerciseName}}).sort({weight: 1, reps: -1})
        if (exercises.length > 0) {
            res.send({
                success: true,
                message: 'Exercises successfully fetched',
                exercises: exercises
            })
        } else {
            res.send({
                success: false,
                message: 'No matching exercises',
            })
        }
        
    }catch(err) {
        res.send({
            success: false,
            message: err.message
        })
    }
}
