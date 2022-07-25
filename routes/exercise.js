import express from 'express';

import auth from '../middleware/auth.js'
import { getExerciseGroup, getAllBodyParts } from '../controllers/exercise.js';

const router = express.Router();

router.get('/allBodyParts', getAllBodyParts) // router.get('/allBodyParts', auth, getAllBodyParts)
router.get('/:bodyPart/:skip', getExerciseGroup); // router.get('/:bodyPart', auth, getExerciseGroup)

export default router;