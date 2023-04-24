'use strict';

/**
 * Deprecated not more, as i have marge both user module only
 *
 */

import express from 'express';
import * as manageCustomerCtrl from '../controller/manageCustomerCtrl';
import * as auth from '../middlewares/auth';
import { catchErrors } from '../handler/errorHandler';

const router = express.Router({ caseSensitive: true });

router.get(
  '/getAll',
  auth.ensureAdminAuth,
  catchErrors(manageCustomerCtrl.getAll)
);
router.get(
  '/get/:id',
  auth.ensureAdminAuth,
  catchErrors(manageCustomerCtrl.getById)
);
router.post('/add', auth.ensureAdminAuth, catchErrors(manageCustomerCtrl.add));
router.post(
  '/update/:id',
  auth.ensureAdminAuth,
  catchErrors(manageCustomerCtrl.update)
);
router.get(
  '/delete/:id',
  auth.ensureAdminAuth,
  catchErrors(manageCustomerCtrl.deleteUser)
);

export default router;
