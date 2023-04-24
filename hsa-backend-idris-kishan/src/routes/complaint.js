'use strict';

import express from 'express';
import * as complaintCtrl from '../controller/complaintCtrl';
import { catchErrors } from '../handler/errorHandler';
import * as auth from '../middlewares/auth';

const router = express.Router({ caseSensitive: true });

router.post('/:id', auth.ensureAuth, catchErrors(complaintCtrl.add));
router.patch('/:id', auth.ensureAuth, catchErrors(complaintCtrl.update));
router.get('/', catchErrors(complaintCtrl.getComplaint));

export default router;
