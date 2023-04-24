'use strict';

import express from 'express';
import * as accessLevelCtrl from '../controller/acessLevelCtrl';
import { catchErrors } from '../handler/errorHandler';
import * as auth from '../middlewares/auth';

const router = express.Router({ caseSensitive: true });

router.get('/', auth.ensureAdminAuth, catchErrors(accessLevelCtrl.getAccessLevels));
router.post('/', auth.ensureAdminAuth, catchErrors(accessLevelCtrl.add));

export default router;
