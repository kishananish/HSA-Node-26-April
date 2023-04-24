'use strict';

import express from 'express';
import * as configurationCtrl from '../controller/configurationCtrl';
import { catchErrors } from '../handler/errorHandler';
import * as auth from '../middlewares/auth';

const router = express.Router({ caseSensitive: true });

router
  .route('/')
  .get(auth.ensureAdminAuth, catchErrors(configurationCtrl.getConfiguration))
  .post(auth.ensureAdminAuth, catchErrors(configurationCtrl.addConfiguration));
export default router;