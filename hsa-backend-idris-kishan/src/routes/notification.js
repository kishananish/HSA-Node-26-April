'use strict';

import express from 'express';
import * as notificationCtrl from '../controller/notificationCtrl';
import { catchErrors } from '../handler/errorHandler';
import * as auth from '../middlewares/auth';
import { default as validate } from '../middlewares/validation';
import { default as notificationValidator } from '../validation/notification';

const router = express.Router({ caseSensitive: true });

router.get('/notification', auth.ensureAdminAuth, catchErrors(notificationCtrl.getNotifications));
router.get('/notification/:id', auth.ensureAdminAuth, catchErrors(notificationCtrl.getNotificationById));
router.post('/notification', validate(notificationValidator.notification), catchErrors(notificationCtrl.add));
router.delete('/notification/all', auth.ensureAdminAuth, catchErrors(notificationCtrl.removeAll));
router.delete('/notification/:id', auth.ensureAdminAuth, catchErrors(notificationCtrl.remove));
router.post('/notification/send', catchErrors(notificationCtrl.send));


export default router;
