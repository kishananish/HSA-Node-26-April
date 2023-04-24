import express from 'express';
// import { default as user } from './user';
import customer from './customer';
import { default as category } from './category';
import { default as complaint } from './complaint';
import { default as complaintResolution } from './complaintResolution';
import { default as subCategory } from './subCategory';
import { default as faq } from './FAQ';
import { default as contactUs } from './contactUs';
import { default as promoCode } from './promoCode';
import { default as role } from './role';
import { default as accessLevels } from './accessLevels';
import serviceProvider from './serviceProvider';
import admin from './admin';

import { default as serviceRequest } from './serviceRequest';
import service from './service';
import payment from './payment';

import AWSService from './AWSService';
import AWSServicek from './AWSServicek';
import manageUser from './manageUser';
import review from './review';
import dashboard from './dashboard';
import report from './report';
import firebaseService from './firebaseService';
import material from './material';
import notification from './notification';
import activeTime from './activeTime';
import city from './city';
import cards from './cards';
import configuration from './configrations';

const router = express.Router({ caseSensitive: true });

router.use('/user', customer);
router.use('/categories', category);
router.use('/complaint', complaint);
router.use('/complaintResolution', complaintResolution);
router.use('/sub-categories', subCategory);
router.use('/faq', faq);
router.use('/contact-us', contactUs);
router.use('/promo-code', promoCode);
router.use('/role', role);
router.use('/access-level', accessLevels);

router.use('/service-request', serviceRequest);
router.use('/service', service);
router.use('/payment', payment);
router.use('/manageCustomer', manageUser);
router.use('/manageUser', manageUser);

router.use('/aws', AWSService);
router.use('/awsk', AWSServicek);
router.use('/firebase', firebaseService);

router.use('/providers', serviceProvider, activeTime, notification);
router.use('/admin', admin, dashboard, report, notification);
router.use('/review', review);
router.use('/material', material);
router.use('/cities', city);
router.use('/cards', cards);
router.use('/configuration', configuration);

export default router;
