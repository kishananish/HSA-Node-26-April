'use strict';

import express from 'express';
import * as roleCtrl from '../controller/roleCtrl';
import { catchErrors } from '../handler/errorHandler';
import * as auth from '../middlewares/auth';
import { default as validate } from '../middlewares/validation';
import { default as roleValidator }  from '../validation/role';

const router = express.Router({ caseSensitive: true });

router.get('/', auth.ensureAdminAuth, catchErrors(roleCtrl.getRoles));
router.get('/:id', auth.ensureAdminAuth, catchErrors(roleCtrl.getRoleById));
router.post('/', auth.ensureAdminAuth, validate(roleValidator.role), catchErrors(roleCtrl.add));
router.patch('/:id', auth.ensureAdminAuth, validate(roleValidator.role), catchErrors(roleCtrl.update));
router.delete('/all', auth.ensureAdminAuth, catchErrors(roleCtrl.removeAll));
router.delete('/:id', auth.ensureAdminAuth, catchErrors(roleCtrl.remove));

export default router;
