import express from 'express';
import * as customerCtrl from '../controller/customerCtrl';
import { default as validate } from '../middlewares/validation';
import { default as customerValidator } from '../validation/customer';
import { catchErrors } from '../handler/errorHandler';
import * as auth from '../middlewares/auth';
const methos = require('../controller/protoType');

const router = express.Router({ caseSensitive: true });

router.post(
  '/signup',
  validate(customerValidator.mobileSignup),
  catchErrors(customerCtrl.mobileSignup)
);
router.post(
  '/signin',
  // validate(customerValidator.mobileSignup),
  catchErrors(customerCtrl.mobileSignin)
);
router.post(
  '/facebook',
  validate(customerValidator.facebookLogin),
  customerCtrl.facebookLogin
);
router.post(
  '/google',
  validate(customerValidator.googleLogin),
  customerCtrl.googleLogin
);
router.post('/apple', customerCtrl.appleLogin);
router.post(
  '/check-user-exist',
  validate(customerValidator.appleLoginCheck),
  customerCtrl.appleLoginCheck
);
router.post(
  '/send-otp',
  validate(customerValidator.sendOtp),
  catchErrors(customerCtrl.sendOtp)
);

router.post(
  '/send-provider-otp',
  validate(customerValidator.sendOtp),
  catchErrors(customerCtrl.sendProviderOtp)
);

router.post(
  '/verify-otp',
  validate(customerValidator.verifyOtp),
  catchErrors(customerCtrl.verifyOtp)
);

router.post(
  '/provider-verify-otp',
  validate(customerValidator.verifyOtp),
  catchErrors(customerCtrl.providerVerifyOtp)
);

router.post('/generate-otp', catchErrors(customerCtrl.generateOtp));
router.post('/check', catchErrors(customerCtrl.contactCheck));
router.post('/checkuser', catchErrors(customerCtrl.checkuser));
router.post(
  '/reauthenticate',
  auth.ensureAuth,
  catchErrors(customerCtrl.reauthenticateOTP)
);
router.post(
  '/get-latest-device/:role',
  auth.ensureAuth,
  validate(customerValidator.getLatestDeviceId),
  catchErrors(customerCtrl.getLatestDeviceId)
);
router.post(
  '/otp/check',
  auth.ensureAuth,
  catchErrors(customerCtrl.reVerifyingOtp)
);
router.get('/test', customerCtrl.tester);

router.post(
  '/social/contact',
  auth.ensureAuth,
  catchErrors(customerCtrl.addContactForSocialSignup)
);
router.post(
  '/social/verify-mobile',
  validate(customerValidator.socail_verify_contact),
  catchErrors(customerCtrl.socialVerifyContactNumber)
);

router.get('/', auth.ensureAuth, catchErrors(customerCtrl.getCustomerById));
router.put(
  '/',
  auth.ensureAuth,
  validate(customerValidator.editCustomer),
  catchErrors(customerCtrl.editCustomer)
);

router.post('/address', auth.ensureAuth, catchErrors(customerCtrl.addAddress));
router.put(
  '/address/:addressId',
  auth.ensureAuth,
  catchErrors(customerCtrl.updateAddress)
);
router.delete(
  '/address/:addressId',
  auth.ensureAuth,
  catchErrors(customerCtrl.deleteAddress)
);

// Admin Routes

router.get(
  '/admin/all',
  auth.ensureAdminAuth,
  catchErrors(customerCtrl.getCustomerList)
);
router.get(
  '/admin/:id',
  auth.ensureAdminAuth,
  catchErrors(customerCtrl.getById)
);
router.post('/admin/add', auth.ensureAdminAuth, catchErrors(customerCtrl.add));

router.post('/create', catchErrors(customerCtrl.create));

router.put(
  '/admin/:id',
  auth.ensureAdminAuth,
  catchErrors(customerCtrl.updateUser)
);
router.delete(
  '/admin/all',
  auth.ensureAdminAuth,
  catchErrors(customerCtrl.removeAll)
);
router.delete(
  '/admin/:id',
  auth.ensureAdminAuth,
  catchErrors(customerCtrl.remove)
);
router.get(
  '/admin/history/:id',
  auth.ensureAdminAuth,
  catchErrors(customerCtrl.history)
);

export default router;
