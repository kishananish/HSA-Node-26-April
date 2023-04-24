import express from 'express';
import * as paymentCtrl from '../controller/paymentCtrl';
import { catchErrors } from '../handler/errorHandler';
import * as auth from '../middlewares/auth';

// import { default as validate } from '../middlewares/validation';

const router = express.Router({ caseSensitive: true });
// catchErrors()
router.post('/', auth.ensureAuth, catchErrors(paymentCtrl.addPayment));
router.post('/admin/deposit', auth.ensureAdminAuth, catchErrors(paymentCtrl.updatePayment));
router.get('/card/:id', paymentCtrl.getCardDetails);
router.post('/payfort/token', catchErrors(paymentCtrl.getpayfortTokenSignature));
router.post('/payfort/merchantUrl', paymentCtrl.getPayfortMerchantUrl);
router.post('/updatepaymentstatus',  paymentCtrl.updatePaymentStatus);
// catchErrors(
export default router;
