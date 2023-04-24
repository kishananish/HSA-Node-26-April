'use strict';

import express from 'express';
import * as manageUserCtrl from '../controller/manageUserCtrl';
import * as auth from '../middlewares/auth';
import { catchErrors } from '../handler/errorHandler';
import { default as validate } from '../middlewares/validation';
import { default as adminValidator } from '../validation/admin';
import { default as customerValidator } from '../validation/customer';
const router = express.Router({ caseSensitive: true });

router.get('/all', auth.ensureAdminAuth, catchErrors(manageUserCtrl.getAll));
router.get(
  '/get/:id',
  auth.ensureAdminAuth,
  catchErrors(manageUserCtrl.getById)
);
router.post(
  '/add',
  validate(customerValidator.mobileSignup),
  catchErrors(manageUserCtrl.add)
); //validate(adminValidator.addUser)

router.post(
  '/createserviceprovider',
  validate(customerValidator.serviceMobileSignup),
  catchErrors(manageUserCtrl.createserviceprovider)
);

router.post(
  '/update/:id',
  auth.ensureAdminAuth,
  catchErrors(manageUserCtrl.updateUser)
);
router.put(
  '/delete/:id',
  auth.ensureAdminAuth,
  catchErrors(manageUserCtrl.remove)
);
router.put(
  '/deleteAll',
  auth.ensureAdminAuth,
  catchErrors(manageUserCtrl.removeAll)
);
router.get(
  '/history/:id',
  auth.ensureAdminAuth,
  catchErrors(manageUserCtrl.history)
);

export default router;
