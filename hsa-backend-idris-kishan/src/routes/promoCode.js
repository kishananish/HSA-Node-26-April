'use strict';

import express from 'express';
import * as promoCodeCtrl from '../controller/promoCodeCtrl';
import * as auth from '../middlewares/auth';
import { catchErrors } from '../handler/errorHandler';

const router = express.Router({ caseSensitive: true });
/**
 * Only ADMIN's CRUD operations on the PromoCodes are going for the history logs
 */
router.get('/', auth.ensureAdminAuth, catchErrors(promoCodeCtrl.index));
router.get('/history', auth.ensureAdminAuth, catchErrors(promoCodeCtrl.getPromoCodeHistory));
router.get('/history/:id', auth.ensureAdminAuth, catchErrors(promoCodeCtrl.getPromoCodeHistoryById));
router.post('/', auth.ensureAdminAuth, catchErrors(promoCodeCtrl.add));
router.patch('/:id', auth.ensureAdminAuth, catchErrors(promoCodeCtrl.update));
router.delete('/all', auth.ensureAdminAuth, catchErrors(promoCodeCtrl.removeAll));
router.delete('/:id', auth.ensureAdminAuth, catchErrors(promoCodeCtrl.remove));
router.post('/:category_id/apply', auth.ensureAuth, catchErrors(promoCodeCtrl.apply));

export default router;
