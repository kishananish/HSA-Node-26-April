'use strict';

import express from 'express';
import * as activeTimeCtrl from '../controller/activeTimeCtrl';
import { catchErrors } from '../handler/errorHandler';
import * as auth from '../middlewares/auth';

const router = express.Router({ caseSensitive: true });

router.post('/active', auth.ensureServiceProviderAuth, catchErrors(activeTimeCtrl.addActiveTime));

export default router;