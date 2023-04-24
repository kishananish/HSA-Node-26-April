import express from 'express';
import * as reportCtrl from '../controller/reportCtrl';
import { catchErrors } from '../handler/errorHandler';
import * as auth from '../middlewares/auth';

const router = express.Router({ caseSensitive: true });

router.get('/report/service-request', auth.ensureAdminAuth, catchErrors(reportCtrl.serviceRequest));
router.get('/report/rating', auth.ensureAdminAuth, catchErrors(reportCtrl.getRating));
router.get('/report/earning', auth.ensureAdminAuth, catchErrors(reportCtrl.totalEarning));
router.get('/report/active-time', auth.ensureAdminAuth, catchErrors(reportCtrl.activeTimeReport));
router.get('/report/response-time', auth.ensureAdminAuth, catchErrors(reportCtrl.responseTimeReport));

export default router;