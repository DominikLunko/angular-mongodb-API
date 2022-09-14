import express from 'express';

import auth from '../middleware/auth.js';
import { signin, signout, signup, refreshToken, updateUser, saveAnalytics,
getUserAnalytics, addToFavourite, addToDailyCaloryIntake, saveWorkoutPlan, deleteWorkoutPlan } from '../controllers/user.js';

const router = express.Router();

router.post('/signin', signin);
router.post('/signup', signup);
router.get('/signout', signout);
router.get('/refresh-token/:userId', refreshToken);
router.put('/update-user', updateUser);
router.post('/save-user-analytics/:userId', saveAnalytics)
router.get('/get-user-analytics', getUserAnalytics)
router.patch('/:nutrientId/add-to-favourite/:userId', addToFavourite);
router.post('/daily-calory-intake/:userId', addToDailyCaloryIntake);
router.post('/save-workout-plan/:userId', saveWorkoutPlan)
router.delete('/delete-workout-plan/:workoutId/:userId', deleteWorkoutPlan)

export default router;