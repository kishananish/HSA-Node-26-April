'use strict';

import express from 'express';
import * as contactUsCtrl from '../controller/contactUsCtrl';
import { catchErrors } from '../handler/errorHandler';
import * as auth from '../middlewares/auth';

const router = express.Router({ caseSensitive: true });

router.get('/', auth.ensureAuth, catchErrors(contactUsCtrl.index));
router.get('/admin', auth.ensureAdminAuth, catchErrors(contactUsCtrl.queryForAdmin));
router.get('/history', auth.ensureAdminAuth, catchErrors(contactUsCtrl.getContactUsHistory));
router.get('/history/:id', auth.ensureAdminAuth, catchErrors(contactUsCtrl.getContactUsHistoryById));
router.post('/', auth.ensureAuth, catchErrors(contactUsCtrl.add));
router.patch('/:id', auth.ensureAdminAuth, catchErrors(contactUsCtrl.update));
router.delete('/all', auth.ensureAdminAuth, catchErrors(contactUsCtrl.removeAll));
router.delete('/:id', auth.ensureAdminAuth, catchErrors(contactUsCtrl.remove));
router.get('/info', catchErrors(contactUsCtrl.infoPage));


export default router;
