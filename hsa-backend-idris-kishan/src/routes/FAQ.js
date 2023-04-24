'use strict';

import express from 'express';
import * as faqCtrl from '../controller/faqCtrl';
import { catchErrors } from '../handler/errorHandler';
import * as auth from '../middlewares/auth';

const router = express.Router({ caseSensitive: true });

router.get('/', catchErrors(faqCtrl.index));
router.get('/statsByCategeory',catchErrors(faqCtrl.getFAQStatsByCategory));
router.get('/:category', catchErrors(faqCtrl.getFAQByCategory));
router.get('/history', catchErrors(faqCtrl.getFAQHistory));
router.get('/history/:id', catchErrors(faqCtrl.getFAQHistoryById));
router.post('/', auth.ensureAuth, catchErrors(faqCtrl.add));
router.patch('/:id', auth.ensureAuth, catchErrors(faqCtrl.update));
router.delete('/all', auth.ensureAuth, catchErrors(faqCtrl.removeAll));
router.delete('/:id', auth.ensureAuth, catchErrors(faqCtrl.remove));

export default router;
