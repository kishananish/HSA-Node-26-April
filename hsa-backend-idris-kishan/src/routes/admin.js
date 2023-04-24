import express from 'express';
import * as adminCtrl from '../controller/adminCtrl';
import { default as validate } from '../middlewares/validation';
import { default as adminValidator } from '../validation/admin';
import { catchErrors } from '../handler/errorHandler';
import * as auth from '../middlewares/auth';

const router = express.Router({ caseSensitive: true });

router.post('/signin', catchErrors(adminCtrl.signin));
router.post(
  '/forgot',
  validate(adminValidator.forgotPassword),
  catchErrors(adminCtrl.forgotPassword)
);
router.get(
  '/search-users',
  auth.ensureAdminAuth,
  catchErrors(adminCtrl.searchUsers)
);
router.get(
  '/reset/:token',
  validate(adminValidator.resetPassword),
  catchErrors(adminCtrl.resetPassword)
);

router.get(
  '/payment',
  //validate(adminValidator.resetPassword),
  catchErrors(adminCtrl.payment)
);

router.post('/update/:token', catchErrors(adminCtrl.updatePassword));
router.post(
  '/change-password',
  auth.ensureAdminAuth,
  validate(adminValidator.changePassword),
  catchErrors(adminCtrl.changePassword)
);
router.get('/', auth.ensureAdminAuth, catchErrors(adminCtrl.getUser));
//router.post('/add-configuration', catchErrors(adminCtrl.addConfiguration));
export default router;
