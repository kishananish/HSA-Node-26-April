'use strict';

import express from 'express';
import * as materialCtrl from '../controller/materialCtrl';
import { catchErrors } from '../handler/errorHandler';
import * as auth from '../middlewares/auth';
import { default as validate } from '../middlewares/validation';
import { default as materialValidator }  from '../validation/material';

const router = express.Router({ caseSensitive: true });

router.get('/', auth.ensureAdminAuth, catchErrors(materialCtrl.getMaterials));
router.get('/history', auth.ensureAdminAuth, catchErrors(materialCtrl.getMaterialHistory));
router.get('/history/:id', auth.ensureAdminAuth, catchErrors(materialCtrl.getMaterialHistoryById));
router.get('/provider', auth.ensureServiceProviderAuth, catchErrors(materialCtrl.getMaterialsForProvider));
router.get('/provider/:id', auth.ensureServiceProviderAuth, catchErrors(materialCtrl.getMaterialByIdForProvider));
router.get('/:id', auth.ensureServiceProviderAuth, catchErrors(materialCtrl.getMaterialById));
// add material by admin and provider
router.post('/', auth.ensureAuth,validate(materialValidator.material), catchErrors(materialCtrl.add)); 

//TODO change permission
router.put('/:id', auth.ensureAuth, catchErrors(materialCtrl.update));
router.delete('/all', auth.ensureAuth, catchErrors(materialCtrl.removeAll));
router.delete('/:id', auth.ensureAuth, catchErrors(materialCtrl.remove));

export default router;
