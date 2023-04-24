import express from 'express';
import * as dashboardCtrl from '../controller/dashboardCtrl';
import { catchErrors } from '../handler/errorHandler';
import * as auth from '../middlewares/auth';

const router = express.Router({ caseSensitive: true });

router.get('/dashboard', auth.ensureAdminAuth, catchErrors(dashboardCtrl.dashboard));
router.get('/dashboard/sale-chart', auth.ensureAdminAuth, catchErrors(dashboardCtrl.saleGrowthGraph));
router.get('/dashboard/customer-growth', auth.ensureAdminAuth, catchErrors(dashboardCtrl.customerGrowthGraph));

export default router;