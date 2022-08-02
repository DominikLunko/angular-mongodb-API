import express from 'express';

import auth from '../middleware/auth.js'
import { getExerciseGroup, getAllBodyParts, /*getCountOfExerciseGroup*/ } from '../controllers/exercise.js';

const router = express.Router();

router.get('/allBodyParts', getAllBodyParts) // router.get('/allBodyParts', auth, getAllBodyParts)
router.post('/exercise-list', getExerciseGroup); // router.get('/:bodyPart', auth, getExerciseGroup)
// router.post('/count-exercise', getCountOfExerciseGroup)
export default router;