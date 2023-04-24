import express from 'express';
import * as providerCtrl from '../controller/serviceProviderCtrl';
import { default as validate } from '../middlewares/validation';
import { default as providerValidator } from '../validation/provider';
import { catchErrors } from '../handler/errorHandler';
import * as auth from '../middlewares/auth';

const router = express.Router({ caseSensitive: true });

router.post('/send-otp', catchErrors(providerCtrl.sendOtp));
router.post('/signin', catchErrors(providerCtrl.mobileSignin));
router.post(
  '/resend-otp',
  validate(providerValidator.sendOtp),
  catchErrors(providerCtrl.resendOtp)
);

router.get(
  '/',
  auth.ensureServiceProviderAuth,
  catchErrors(providerCtrl.getUser)
);
router.put(
  '/',
  auth.ensureServiceProviderAuth,
  validate(providerValidator.editUser),
  catchErrors(providerCtrl.editUser)
);

router.post(
  '/address',
  auth.ensureServiceProviderAuth,
  //validate(providerValidator.addAddress),
  catchErrors(providerCtrl.addAddress)
);
router.put(
  '/address/:addressId',
  auth.ensureServiceProviderAuth,
  catchErrors(providerCtrl.updateAddress)
);
router.delete(
  '/address/:addressId',
  auth.ensureServiceProviderAuth,
  catchErrors(providerCtrl.deleteAddress)
);

export default router;
