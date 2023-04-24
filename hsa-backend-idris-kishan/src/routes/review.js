'use strict';

import express from 'express';
import * as reviewCtrl from '../controller/reviewCtrl';
import { catchErrors } from '../handler/errorHandler';
import * as auth from '../middlewares/auth';
import { default as validate } from '../middlewares/validation';
import { default as reviewValidator } from '../validation/review';
const router = express.Router({ caseSensitive: true });

router.post('/customer', auth.ensureAuth, validate(reviewValidator.giveReviewToProvider), catchErrors(reviewCtrl.giveReviewToProvider));
router.post('/provider', auth.ensureServiceProviderAuth, validate(reviewValidator.giveReviewToCustomer), catchErrors(reviewCtrl.giveReviewToCustomer));

export default router;

