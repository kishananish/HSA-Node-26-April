'use strict';

import express from 'express';
import * as complaintResolutionCtrl from '../controller/complaintResolutionCtrl';
import * as auth from '../middlewares/auth';

const router = express.Router({ caseSensitive: true });

router.post('/addResolution', auth.ensureAuth, complaintResolutionCtrl.addResolution);

router.post('/updateResolution', auth.ensureAuth, complaintResolutionCtrl.updateResolution);

export default router;