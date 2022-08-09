import express from 'express';

import auth from '../middleware/auth.js';
import { signin, signout, signup, refreshToken, updateUser, saveAnalytics,
getUserAnalytics, addToFavourite, addToDailyCaloryIntake, saveWorkoutPlan, deleteWorkoutPlan } from '../controllers/user.js';

const router = express.Router();

router.post('/signin', signin);
router.post('/signup', signup);
router.get('/signout', signout);
router.get('/refresh-token', auth, refreshToken);
router.put('/update-user', auth, updateUser);
router.post('/save-user-analytics', auth, saveAnalytics)
router.get('/get-user-analytics', auth, getUserAnalytics)
router.patch('/:nutrientId/add-to-favourite', auth, addToFavourite);
router.post('/daily-calory-intake', auth, addToDailyCaloryIntake);
router.post('/save-workout-plan', auth, saveWorkoutPlan)
router.delete('/delete-workout-plan/:workoutId', auth, deleteWorkoutPlan)

export default router;