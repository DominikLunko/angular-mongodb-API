import express from 'express';

import auth from '../middleware/auth.js'
import { getExerciseGroup } from '../controllers/exercise.js';

const router = express.Router();

router.get('/:id', auth, getExerciseGroup);

export default router;