import express from 'express';
import * as userCtrl from '../controller/userCtrl';
import { default as validate } from '../middlewares/validation';
import { default as userValidator }  from '../validation/user';
import { catchErrors } from '../handler/errorHandler';
import * as auth from '../middlewares/auth';

const router = express.Router({ caseSensitive: true });

router.post('/signup', validate(userValidator.mobileSignup), catchErrors(userCtrl.mobileSignup));
router.post('/signin', catchErrors(userCtrl.mobileSignin));
router.post('/facebook', validate(userValidator.facebookLogin), userCtrl.facebookLogin);
router.post('/google', validate(userValidator.googleLogin), userCtrl.googleLogin);
router.post('/apple', validate(userValidator.appleLogin), userCtrl.appleLogin);
router.post('/send-otp', validate(userValidator.sendOtp), catchErrors(userCtrl.sendOtp));
router.post('/verify-otp', validate(userValidator.verifyOtp), catchErrors(userCtrl.verifyOtp));
router.post('/generate-otp', validate(userValidator.sendOtp), catchErrors(userCtrl.generateOtp));

router.get('/', auth.ensureServiceProviderAuth, catchErrors(userCtrl.getUser));
router.get('/all', auth.ensureAdminAuth, catchErrors(userCtrl.getCustomerList));
router.put('/', auth.ensureServiceProviderAuth, validate(userValidator.editUser), catchErrors(userCtrl.editUser));
router.delete('/', auth.ensureServiceProviderAuth, catchErrors(userCtrl.deleteUser));

router.post('/address', auth.ensureServiceProviderAuth, validate(userValidator.addAddress), catchErrors(userCtrl.addAddress));
router.put('/address/:addressId', auth.ensureServiceProviderAuth, catchErrors(userCtrl.updateAddress));
router.delete('/address/:addressId', auth.ensureServiceProviderAuth, catchErrors(userCtrl.deleteAddress));

export default router;