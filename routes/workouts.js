import express from 'express';


import auth from '../middleware/auth.js';
import { renameAttibutes, getExercisesByName } from '../controllers/workouts.js';

const router = express.Router();


router.get('/rename-workout', renameAttibutes);
router.get('/get-workouts-by-name/:exerciseName', getExercisesByName);
export default router;
