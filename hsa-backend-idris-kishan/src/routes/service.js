import express from 'express';
import * as serviceCtrl from '../controller/serviceCtrl';
import * as locationCtrl from '../controller/locationCtrl';

import { catchErrors } from '../handler/errorHandler';
import * as auth from '../middlewares/auth';
import * as localizaton from '../middlewares/language';
import { default as validate } from '../middlewares/validation';
import { default as serviceValidator } from '../validation/service';

const router = express.Router({ caseSensitive: true });

/* User routes */

router.post('/user', auth.ensureAuth, catchErrors(serviceCtrl.add)); // create service request by user

router.get(
  '/user',
  auth.ensureAuth,
  catchErrors(serviceCtrl.serviceListForUser)
); // create serviceList by user
router.get(
  '/user/progress',
  auth.ensureAuth,
  catchErrors(serviceCtrl.serviceListForUserByProgress)
);
router.post(
  '/user/complain',
  auth.ensureAuth,
  validate(serviceValidator.raiseComplainByUser),
  catchErrors(serviceCtrl.addComplainForService)
);
router.get(
  '/user/:id',
  auth.ensureAuth,
  catchErrors(serviceCtrl.serviceByIdForUser)
);
router.put(
  '/user/cancel/:service_id',
  auth.ensureAuth,
  validate(serviceValidator.rejectNewServiceByUser),
  catchErrors(serviceCtrl.rejectNewServiceByUser)
);
router.put(
  '/user/:id',
  auth.ensureAuth,
  validate(serviceValidator.acceptOrRejectServiceQuoteByUser),
  catchErrors(serviceCtrl.acceptOrRejectServiceQuoteByUser)
);
// router.get('/user/:id', auth.ensureAuth, validate(serviceValidator.acceptOrRejectServiceQuoteByUser), catchErrors(serviceCtrl.acceptOrRejectServiceQuoteByUser));

/* Service_provider routes */
router.get(
  '/provider',
  auth.ensureServiceProviderAuth,
  catchErrors(serviceCtrl.serviceListForProvider)
);
router.get(
  '/provider/progress',
  auth.ensureServiceProviderAuth,
  catchErrors(serviceCtrl.serviceListForProviderByProgress)
);
router.get(
  '/providers/statistics',
  auth.ensureServiceProviderAuth,
  catchErrors(serviceCtrl.serviceProviderStatistics)
);
router.get(
  '/provider/:id',
  auth.ensureServiceProviderAuth,
  catchErrors(serviceCtrl.serviceByIdForProvider)
);
router.put(
  '/provider/:id',
  auth.ensureServiceProviderAuth,
  localizaton.language,
  catchErrors(serviceCtrl.updateServiceRequestByProvider)
);
router.get(
  '/providers',
  auth.ensureServiceProviderAuth,
  catchErrors(serviceCtrl.serviceProviderList)
);
router.post(
  '/socket',
  auth.ensureServiceProviderAuth,
  catchErrors(locationCtrl.locationTracker)
);

/* Admin Routes */
router.get('/admin/history', catchErrors(serviceCtrl.getServiceHistory));
router.post(
  '/admin/resolution',
  validate(serviceValidator.complainResolution),
  catchErrors(serviceCtrl.addComplainResolution)
);
router.get('/admin/history/:id', catchErrors(serviceCtrl.getServiceHistory));
router.get(
  '/admin',
  auth.ensureAdminAuth,
  catchErrors(serviceCtrl.serviceListForAdmin)
);
router.get(
  '/admin/:id',
  auth.ensureAdminAuth,
  catchErrors(serviceCtrl.serviceByIdForAdmin)
);
router.put(
  '/admin/:id',
  auth.ensureAdminAuth,
  catchErrors(serviceCtrl.updateServiceRequestByAdmin)
);
router.delete(
  '/admin/:id',
  auth.ensureAdminAuth,
  catchErrors(serviceCtrl.deleteSingleServiceByAdmin)
);
router.delete(
  '/admin',
  auth.ensureAdminAuth,
  catchErrors(serviceCtrl.deleteServiceByAdmin)
);

export default router;
