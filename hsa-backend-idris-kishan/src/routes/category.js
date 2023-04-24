'use strict';

import express from 'express';
import * as categoryCtrl from '../controller/categoryCtrl';
import { catchErrors } from '../handler/errorHandler';
import * as auth from '../middlewares/auth';

const router = express.Router({ caseSensitive: true });

router.get('/', catchErrors(categoryCtrl.index));
router.get('/:id/sub-categories', catchErrors(categoryCtrl.getRelatedSubCategories));
router.get('/history', catchErrors(categoryCtrl.getCategoryHistory));
router.get('/history/:id', catchErrors(categoryCtrl.getCategoryHistory));
router.post('/', auth.ensureAdminAuth, catchErrors(categoryCtrl.add));
router.patch('/:id', auth.ensureAdminAuth, catchErrors(categoryCtrl.update));
router.delete('/all', auth.ensureAdminAuth, catchErrors(categoryCtrl.removeAll));
router.delete('/:id', auth.ensureAdminAuth, catchErrors(categoryCtrl.remove));
router.get('/category-search', catchErrors(categoryCtrl.searchCategories));

export default router;
