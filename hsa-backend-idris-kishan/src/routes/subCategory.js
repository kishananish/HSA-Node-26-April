'use strict';

import express from 'express';
import * as subCategoryCtrl from '../controller/subCategoryCtrl';
import * as auth from '../middlewares/auth';
import { catchErrors } from '../handler/errorHandler';

const router = express.Router({ caseSensitive: true });

router.get('/', catchErrors(subCategoryCtrl.index));
router.get('/history', catchErrors(subCategoryCtrl.getSubCategoryHistory));
router.get('/history/:id', catchErrors(subCategoryCtrl.getSubCategoryHistory));
router.post('/', auth.ensureAuth, catchErrors(subCategoryCtrl.add));
router.patch('/:id', auth.ensureAuth, catchErrors(subCategoryCtrl.update));
router.delete('/all', auth.ensureAuth, catchErrors(subCategoryCtrl.removeAll));
router.delete('/:id', auth.ensureAuth, catchErrors(subCategoryCtrl.remove));

export default router;
