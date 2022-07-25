import Exercise from '../models/exercise.js';
import BodyPart from '../models/bodyPart.js';

export const getExerciseGroup = async (req, res) => {
    const { bodyPart, skip } = req.params;
    try {
        const exercises = await Exercise.find({bodyPart: bodyPart}).sort({name: 1}).skip(skip).limit(8)
        res.status(200).json({ 
            message: 'Exercise group fetched',
            success: true,
            exercises: exercises
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Something went wrong',
            success: false
        });
    }
}
export const getAllBodyParts = async (req, res) => {
    try {
        const bodyParts = await BodyPart.find() 
        res.status(200).json({ 
            message: 'Body parts fetched',
            success: true,
            bodyParts: bodyParts
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Something went wrong',
            success: false
        });
    }
}