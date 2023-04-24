import moment from 'moment';
import Service from '../models/Service';
import Customer from '../models/Customer';
import formatResponse from '../../utils/formatResponse';
import User from '../models/User';
import config from '../../config/config';
import operationConfig from '../../config/operationConfig';
import ServiceHistory from '../models/ServiceHistory';
import ServiceActivity from '../models/ServiceActivity';
import Role from '../models/Role';
import {
  sendPushNotification,
  sendPushNotificationToMultiple,
} from '../handler/pushNotification';
import Configuration from '../models/Configuration';
import _ from 'lodash';
import Payment from '../models/Payment';
import Review from '../models/Review';
import PromoCode from '../models/PromoCode';
const SERVICE_IMAGE_SERVER_URL = config.IMAGE_SERVER_URL;
import * as constants from '../../src/handler/constants';
import * as uploadHelper from './../handler/AWSService';
//import { ConfigurationServicePlaceholders } from "aws-sdk/lib/config_service_placeholders";

export const scheduler = async () => {
  const startOfDay = new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString(); // 00:00AM
  const endOfDay = new Date(
    new Date().setUTCHours(23, 59, 59, 999)
  ).toISOString(); // 23:59PM
  const roleToSend = constants.SERVICE_PROVIDER;

  const todays_pending_requests = await Service.find({
    is_future_request_fired: false,
    schedule_at: { $gte: startOfDay, $lt: endOfDay },
  });
  if (todays_pending_requests && todays_pending_requests.length) {
    todays_pending_requests.map(async (item) => {
      let payload = {
        notification: {
          title: 'New Service Request',
          body: 'Please update service request',
        },
        data: {
          requestId: item._id,
          status: 'new',
          user: 'Service Provider',
          targetScreen: 'MyRequests',
        },
      };

      item.notified_providers.forEach(async (i) => {
        let users = await User.findById(i);
        let deviceIds = users.device_id;
        // if (getLanguage(users._id) !== 'en') {
        payload.notification = {
          title: 'طلب خدمة جديد',
          body: ' الرجاء تحديث حالة الطلب',
        };
        // }

        (item.is_future_request_fired = true),
          item
            .save()
            .then((success) =>
              sendPushNotificationToMultiple([deviceIds], payload, roleToSend)
            )
            .catch((err) =>
              console.log(
                `error on saving is_future_request_fired for serviceID: ${item._id} with ${err}`
              )
            );
      });
    });
  }
};

// const getLanguage = async (req) => {
// 	const user = await User.findOne({ _id: req.user });
// 	return user.preferred_language;
// }
export const add = async (req, res) => {
  const { latitude, longitude } = req.body;

  const userId = req.user;

  // const userId = 'ZXXW9Ikwa';
  // const preferredLanguage = getLanguage(req);
  const promoId = req.body.promo;
  const categoryId = req.body.category_id;
  req.body.customer_id = userId;

  const providers = await findServiceProviders(latitude, longitude, categoryId);

  const roleToSend = constants.SERVICE_PROVIDER;
  if (!providers.length) {
    const error = new Error('Service providers not available in your area!');
    error.ar_message = 'مزودي الخدمة غير متوفرين في منطقتك!';
    error.name = 'DataNotFound';
    return formatResponse(res, error);
  }

  if (promoId) {
    const code = await PromoCode.findById(promoId);
    console.log('prpo code :', code);
    if (!code) {
      const error = new Error('Invalid Promo-code!');
      error.ar_message = 'الرمز الترويجي غير صالح!';
      error.name = 'DataNotFound';
      return formatResponse(res, error);
    }
    req.body.promocode_id = code._id;
    req.body.isPromoApplied = true;
    req.body.promo_amount = code.amount;
    req.body.promo_percentage = code.percentage;
  }
  const date = req.body.request_date;
  req.body.schedule_at = date ? moment(`${date}`) : moment();
  if (req.body.schedule_at) {
    if (new Date(req.body.schedule_at) > new Date())
      req.body.progress = 'queue';
  }
  if (req.body.request_date) {
    req.body.is_future_request_fired = false;
  }
  console.log(req.body);
  const createdRequest = await Service.create(req.body);
  const serviceActivityData = providers.map((provider) => {
    if (provider) {
      return {
        service_id: createdRequest._id,
        category_id: req.body.category_id,
        sub_category_id: req.body.sub_category_id,
        customer_id: userId,
        service_provider_id: provider._id,
        progress: 'assigned',
      };
    }
  });
  await ServiceActivity.insertMany(serviceActivityData);
  let deviceIds = providers
    ? providers.map((provider) => provider.device_id)
    : '';
  await providers.map((provider) =>
    createdRequest.notified_providers.push(provider._id)
  );

  deviceIds = deviceIds.filter((e) => {
    return e;
  });

  let notificationBody = {};
  let payload = {
    notification: notificationBody,
    data: {
      requestId: createdRequest._id,
      status: 'new',
      user: 'Service Provider',
      targetScreen: 'MyRequests',
    },
  };
  await createdRequest.save();
  if (createdRequest.progress == 'new') {
    deviceIds.forEach(async (id) => {
      const serviceProvider = await User.findOne({ device_id: id });
      const preferredLanguage = serviceProvider.preferred_language;
      if (preferredLanguage === 'en') {
        payload.notification = {
          title: 'New Service Request',
          body: 'Please update service request',
        };
      } else {
        payload.notification = {
          title: 'طلب خدمة جديد',
          body: ' الرجاء تحديث حالة الطلب',
        };
      }
      sendPushNotification([id], payload, roleToSend);
    });
    // await sendPushNotification([id], payload, roleToSend);
    // sendPushNotificationToMultiple(deviceIds, payload, roleToSend);
  }

  // For now only admin history maintained
  /* const history = new ServiceHistory({
				service_id: createdRequest._id,
				operation: operationConfig.operations.add,
				operator: userId,
				prevObj: null,
				updatedObj: createdRequest,
				operation_date: new Date()
			});
			await history.save(); */
  formatResponse(res, createdRequest);
};

const findServiceProviders = async (latitude, longitude, categoryId) => {
  const foundRole = await Role.findOne({
    name: 'service_provider',
    isDeleted: false,
  });

  if (!foundRole) return [];
  const defaultRadiusDistance = await Configuration.findOne();
  const range = defaultRadiusDistance.range;

  return User.find({
    role: { $in: foundRole._id },
    category_id: { $in: categoryId },
    'addresses.location': {
      $near: {
        $geometry: {
          type: 'Point',
          //coordinates: [longitude, latitude]
          coordinates: [latitude, longitude],
        },
        $maxDistance: range,
      },
    },
  });
};

export const serviceProviderList = async (req, res) => {
  const latitude = req.query.latitude;
  const longitude = req.query.longitude;
  const foundRole = await Role.findOne({
    name: 'service_provider',
    isDeleted: false,
  });
  if (!foundRole) return [];
  const defaultRadiusDistance = await Configuration.findOne();
  const range = defaultRadiusDistance.range;

  const serviceProviders = await User.find({
    role: { $in: foundRole._id },
    'addresses.location': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        $maxDistance: range,
      },
    },
  }).lean();
  formatResponse(res, serviceProviders);
};

/**
 * API for Provider to update the NEW request from the customer
 * @param {*} req
 * @param {*} res
 */
//sp
export const updateServiceRequestByProvider = async (req, res) => {
  const userId = req.user;
  // const language = getLanguage(userId);
  let new_array = [];
  const requestId = req.params.id;
  const service = await Service.findById(requestId)
    .populate('service_provider_id', ['device_id'])
    .populate('customer_id', ['device_id']);

  const sendToRole = constants.CUSTOMER;
  if (!service) {
    const error = new Error();
    error.name = 'DataNotFound';
    error.message = 'Service request not found!';
    error.ar_message = 'طلب خدمة غير موجود';
    return formatResponse(res, error);
  }

  if (service.reschedule_at && req.body.progress === 'rescheduled') {
    const error = new Error();
    error.name = 'CantProceed';
    error.message = 'Cant reschedule any more!';
    error.ar_message = 'لا يمكن إعادة جدولة أي أكثر';
    return formatResponse(res, error);
  }
  if (
    req.body.progress === 'accepted' &&
    service.progress !== 'new' &&
    service.progress !== 'queue'
  ) {
    const error = new Error();
    error.name = 'dataExist';
    error.message = 'Service request already accepted!';
    error.ar_message = 'طلب الخدمة قبلت بالفعل';
    return formatResponse(res, error);
  }
  const date = req.body.reschedule_at;
  if (date) {
    req.body.reschedule_at = moment(date).format('MM/DD/YYYY h:mm a');
  }

  // Rejecting a request will make the user as uninterested, hence, wont list into his tasks any further
  if (req.body.progress === 'rejected' && service.progress === 'new') {
    await Service.update(
      { _id: requestId },
      { $pull: { notified_providers: userId } }
    );
    return formatResponse(res, {});
  }

  let prevObj = service.toObject();
  if (!prevObj.hasOwnProperty('respond_at')) {
    req.body.respond_at = new Date();
  }
  req.body.service_provider_id = userId;
  req.body.progress_at = new Date();

  // provider cancels his started journey
  if (req.body.progress === 'journey_cancelled' && !req.body.cancel_comment) {
    const error = new Error();
    error.name = 'DataNotFound';
    error.message = 'Cancellation Reason missing';
    error.ar_message = 'سبب الإلغاء مفقود';
    return formatResponse(res, error);
  }
  if (req.body.progress === 'journey_cancelled' && req.body.cancel_comment) {
    req.body.cancellation_commment_by_provider = req.body.cancel_comment;
  }
  if (
    req.body.progress === 'paid' &&
    service.progress !== 'payment_done' &&
    service.progress !== 'customer_review'
  ) {
    const error = new Error();
    error.name = 'ValidationError';
    error.message = 'Not available';
    error.ar_message = 'غير متوفر';
    return formatResponse(res, error);
  }
  if (
    req.body.progress === 'paid' &&
    (service.progress === 'payment_done' ||
      service.progress === 'customer_review')
  ) {
    req.body.payment_status = 'paid';
  }
  if (req.body.quote && req.body.quote.length) {
    let total = 0;
    req.body.quote.map((quote) => {
      total = total + Number(quote.cost);
    });
    const service_cost = req.body.service_cost ? req.body.service_cost : 0;
    // Calculating the "total_service_charge" => Quotes + provider's service_cost
    req.body.total_service_charge = total + Number(service_cost);
  }
  if (req.body.progress === 'task_done') {
    new_array = service.media.filter((item) => {
      return item.type != 'after';
    });
    new_array.push(...req.body.media);
    service.progress = 'task_done';
    service.media = new_array;
  } else {
    service.set(req.body);
  }
  let updated_service = await service.save();
  let new_service_acitivity = await ServiceActivity.create({
    service_id: service._id,
    category_id: service.category_id,
    sub_category_id: service.sub_category_id,
    customer_id: service.customer_id,
    service_provider_id: userId,
    progress: req.body.progress,
  });

  Promise.all([updated_service, new_service_acitivity]);

  const userDeviceId =
    updated_service &&
    updated_service.customer_id &&
    updated_service.customer_id.device_id
      ? updated_service.customer_id.device_id
      : null;
  const provider = updated_service.service_provider_id._id
    ? updated_service.service_provider_id._id
    : updated_service.service_provider_id;
  const loggedInProvider = await User.findById(provider);

  const serviceProviderDeviceId =
    loggedInProvider && loggedInProvider.device_id;
  let payload = {},
    notified_providers_devices = [];

  if (req.body.progress === 'accepted') {
    const review = new Review({
      service_id: service._id,
      user_id: service.customer_id,
      service_provider_id: userId,
    });
    await review.save();
    const notified_providers = updated_service.notified_providers;
    await Promise.all(
      notified_providers.map(async (item) => {
        let devices = await User.findById(item);
        if (devices && devices.device_id && devices.device_id !== '') {
          notified_providers_devices.push(devices.device_id);
        }
      })
    );
    if (serviceProviderDeviceId && notified_providers_devices.length > 0) {
      notified_providers_devices = notified_providers_devices.filter(
        (i) => i !== serviceProviderDeviceId
      );
    }
    payload = {
      data: {
        requestId: service._id,
        status: req.body.progress,
        flag: '1',
        user: 'User',
        targetScreen: 'RequestStatus',
      },
    };
    let payloads = {
      data: {
        requestId: service._id,
        status: req.body.progress,
        flag: '2',
        user: 'Service Provider',
        targetScreen: 'RequestStatus',
      },
    };

    if (userDeviceId) {
      [userDeviceId].forEach(async (deviceid) => {
        const cust = await Customer.findOne({ device_id: deviceid });
        const language = cust.preferred_language;

        payload.notification = {
          title: language === 'en' ? 'Congrats!' : 'تهانينا',
          body:
            language === 'en'
              ? `Your Service Request for ${service.description} is Accepted!`
              : ` تم قبول طلب الخدمة ل ${service.description}`,
        };
        console.log([deviceid]);
        console.log(payload);
        console.log(sendToRole);
        await sendPushNotification([deviceid], payload, sendToRole); // sending confirmation notification to the Request-creating User
      });
    }
    notified_providers_devices.forEach(async (device) => {
      const user = await User.findOne({
        device_id: device,
      });
      const language = user.preferred_language;
      payloads.notification = {
        title: language === 'en' ? 'Assigned' : 'تحويل',
        body:
          language === 'en'
            ? `${updated_service.description} Assigned to other Service Provider`
            : `تم تحويل الطلب الى فني اخر - ${updated_service.description}`,
      };
      await sendPushNotification([device], payloads, 'service_provider'); // sending SERVICE confirmation notification to the remaining Providers
    });
    // await sendPushNotificationToMultiple(notified_providers_devices, payloads, 'service_provider'); // sending SERVICE confirmation notification to the remaining Providers
  }
  if (req.body.progress === 'quote_provided') {
    payload = {
      data: {
        requestId: service._id,
        status: req.body.progress,
        flag: '4',
        user: 'User',
        targetScreen: 'QuoteDetails',
      },
    };
    if (userDeviceId) {
      const customer = await Customer.findOne({ device_id: userDeviceId });
      const language = customer.preferred_language;

      payload.notification = {
        title: language == 'en' ? 'Congrats!' : 'تهانينا',
        body:
          language == 'en'
            ? `Service Provider has provided a Quote on ${updated_service.description}`
            : ` ${updated_service.description} قام الفني بارسال عرض السعر`,
      };
      await sendPushNotification([userDeviceId], payload, sendToRole);
    }
  }
  if (req.body.progress === 'reschedule_inprogress') {
    payload = {
      data: {
        requestId: service._id,
        status: req.body.progress,
        flag: '11',
        user: 'User',
        targetScreen: 'QuoteDetails',
      },
    };
    if (userDeviceId) {
      const customer = await Customer.findOne({ device_id: userDeviceId });
      const language = customer.preferred_language;
      payload.notification = {
        title: language === 'en' ? 'Congrats!' : 'تهانينا',
        body:
          language === 'en'
            ? `Service Provider started working on ${updated_service.description}`
            : `${updated_service.description} يقوم الفني بالعمل علي الطلب`,
      };
      await sendPushNotification([userDeviceId], payload, sendToRole);
    }
  }
  if (req.body.progress === 'leave_for_the_job') {
    payload = {
      data: {
        requestId: service._id,
        status: req.body.progress,
        flag: '5',
        user: 'User',
        targetScreen: 'RequestStatus',
      },
    };
    if (userDeviceId) {
      const customer = await Customer.findOne({ device_id: userDeviceId });
      const language = customer.preferred_language;

      payload.notification = {
        title: language === 'en' ? 'Congrats!' : 'تهانينا',
        body:
          language === 'en'
            ? 'Service Provider On the Way'
            : ' الفني في طريقه الى الموقع',
      };
      await sendPushNotification([userDeviceId], payload, sendToRole);
    }
  }
  if (req.body.progress === 'location_reached') {
    payload = {
      data: {
        requestId: service._id,
        status: req.body.progress,
        flag: '9',
        user: 'User',
        targetScreen: 'RequestStatus',
      },
    };
    if (userDeviceId) {
      const customer = await Customer.findOne({ device_id: userDeviceId });
      const language = customer.preferred_language;
      payload.notification = {
        title:
          language === 'en'
            ? 'Service Provider reached your location'
            : 'وصل الفني للموقع',
        body:
          language === 'en'
            ? 'Please grant him access to fix your issue.'
            : ' الرجاء السماح له بالدخول وفحص المشكلة',
      };
      await sendPushNotification([userDeviceId], payload, sendToRole);
    }
  }
  if (req.body.progress === 'task_done') {
    payload = {
      data: {
        requestId: service._id,
        status: req.body.progress,
        flag: '6',
        user: 'User',
        targetScreen: 'TaskDetails',
      },
    };
    if (userDeviceId) {
      const customer = await Customer.findOne({ device_id: userDeviceId });
      const language = customer.preferred_language;
      payload.notification = {
        title: language === 'en' ? 'Congrats!' : 'تهانينا',
        body:
          language === 'en' ? 'Service Request Completed' : ' تم انجاز الطلب',
      };
      await sendPushNotification([userDeviceId], payload, sendToRole);
    }
  }
  if (req.body.progress === 'paid') {
    payload = {
      data: {
        requestId: service._id,
        status: req.body.progress,
        flag: '11',
        user: 'User',
        targetScreen: 'RequestStatus',
      },
    };
    if (userDeviceId) {
      const customer = await Customer.findOne({ device_id: userDeviceId });
      const language = customer.preferred_language;
      payload.notification = {
        title: language === 'en' ? 'Greetings' : 'شكرا لك',
        body:
          language === 'en' ? 'Thanks for the payment!' : 'تم استلام المبلغ',
      };
      await sendPushNotification([userDeviceId], payload, sendToRole);
    }
  }
  /**
   * Misc
   */
  if (req.body.progress === 'rescheduled') {
    // this status comes into schenario after the Quote acception from the customer
    service.set(req.body);
    await service.save();
    payload = {
      data: {
        requestId: service._id,
        status: req.body.progress,
        flag: '7',
        user: 'User',
        targetScreen: 'RequestStatus',
      },
    };
    if (userDeviceId) {
      const customer = await Customer.findOne({ device_id: userDeviceId });
      const language = customer.preferred_language;
      payload.notification = {
        title: language === 'en' ? 'Rescheduled!' : 'إعادة جدولة',
        body:
          language === 'en'
            ? `Your Service for ${
                service.description
              } has been rescheduled for ${moment
                .utc(service.reschedule_at)
                .format('dddd, MMMM Do YYYY, h:mm A')}`
            : `تمت إعادة جدولة خدمتك لـ ${
                service.description
              } بتاريخ ${moment
                .utc(service.reschedule_at)
                .format('dddd, MMMM Do YYYY, h:mm A')}`,
      };
      await sendPushNotification([userDeviceId], payload, sendToRole);
    }
  }
  if (req.body.progress === 'no_response') {
    payload = {
      data: {
        requestId: service._id,
        status: req.body.progress,
        flag: '8',
        user: 'User',
        targetScreen: 'RequestStatus',
      },
    };
    if (userDeviceId) {
      const customer = await Customer.findOne({ device_id: userDeviceId });
      const language = customer.preferred_language;
      payload.notification = {
        title:
          language === 'en'
            ? `Alert on service: ${updated_service.description}`
            : `${updated_service.description}: تنبيه على طلب الخدمة`,
        body:
          language === 'en'
            ? 'Provider returned as we are not getting any response from your end. You will need to raise a new request again.'
            : '  الفني يعالج حالة طارئة سيتم التحديث في اقرب وقت',
      };
      await sendPushNotification([userDeviceId], payload, sendToRole);
    }
  }
  if (req.body.progress === 'journey_cancelled') {
    payload = {
      data: {
        requestId: service._id,
        status: req.body.progress,
        flag: '10',
        user: 'User',
        targetScreen: 'RequestStatus',
      },
    };
    if (userDeviceId) {
      const customer = await Customer.findOne({ device_id: userDeviceId });
      const language = customer.preferred_language;
      payload.notification = {
        title: language === 'en' ? 'Sorry' : 'نأسف',
        body:
          language === 'en'
            ? 'Provider got stuck in some emergency, will soon update the proceedings'
            : '  الفني يعالج حالة طارئة سيتم التحديث في اقرب وقت',
      };
      await sendPushNotification([userDeviceId], payload, sendToRole);
    }
  }
  if (req.body.progress === 'rejected') {
    payload = {
      data: {
        requestId: service._id,
        status: req.body.progress,
        flag: '3',
        user: 'User',
        targetScreen: 'RequestStatus',
      },
    };
    if (userDeviceId) {
      const customer = await Customer.findOne({ device_id: userDeviceId });
      const language = customer.preferred_language;
      payload.notification = {
        title: language === 'en' ? 'Sorry!' : ' نأسف',
        body:
          language === 'en'
            ? 'Your Service Request has been rejected'
            : 'تم رفض طلب الخدمة ',
      };
      await sendPushNotification([userDeviceId], payload, sendToRole);
    }
  }
  // For now only admin history maintained
  /* const history = new ServiceHistory({
		service_id: updated_service._id,
		operation: operationConfig.operations.update,
		operator: userId,
		prevObj: prevObj,
		updatedObj: updated_service,
		operation_date: new Date()
	}); */
  //await history.save();
  formatResponse(res, updated_service);
};

/**
 * API for Customer to accept/reject the recieved Qoute from the Provider
 * @param {*} req
 * @param {*} res
 */
//one consumer
export const acceptOrRejectServiceQuoteByUser = async (req, res) => {
  const userId = req.user;
  const user = User.findOne({ _id: userId });

  const requestId = req.params.id;
  const service = await Service.findOne({ _id: requestId, customer_id: userId })
    .populate('customer_id', ['device_id'])
    .populate('service_provider_id', ['device_id']);
  const sendToRole = constants.SERVICE_PROVIDER;
  if (!service) {
    const error = new Error('Service request not found!');
    error.ar_message = 'طلب الخدمة غير موجود!';
    error.name = 'DataNotFound';
    return formatResponse(res, error);
  }
  let total_percentage_value = service.promo_amount
    ? service.promo_amount
    : (service.total_service_charge / 100) * service.promo_percentage;
  service.set({
    progress: req.body.progress,
    progress_at: new Date(),
    promo_amount: total_percentage_value,
    quote_rejection_comment_by_user: req.body.reason ? req.body.reason : '',
  });
  const updated_service = await service.save();

  const providerDeviceId = updated_service.service_provider_id.device_id;
  let providerParams = {};
  if (req.body.progress === 'quote_accepted') {
    const serviceProvider = await User.findOne({ device_id: providerDeviceId });
    const user = serviceProvider;
    let notificationBody = {};
    if (user.preferred_language === 'en') {
      notificationBody = {
        title: 'Congrats!',
        body: 'Customer Has Accepted Your Quote',
      };
    } else {
      notificationBody = {
        title: ' تهانينا',
        body: ' العميل قبل عرض السعر',
      };
    }
    let providerParams = {
      notification: notificationBody,
      data: {
        requestId: service._id,
        status: 'quote_accepted',
        user: 'Service Provider',
        targetScreen: 'RequestStatus',
      },
    };
    await sendPushNotification([providerDeviceId], providerParams, sendToRole);
  }
  if (req.body.progress === 'payment_done') {
    const serviceProvider = await User.findOne({ device_id: providerDeviceId });
    const language = serviceProvider.preferred_language;
    providerParams = {
      data: {
        service_id: service._id,
        status: req.body.progress,
        user: 'Service Provider',
        targetScreen: 'RequestStatus',
      },
      notification: {
        title: language == 'en' ? 'Congrats!' : ' تهانينا',
        body:
          language == 'en'
            ? 'Payment Done by Customer'
            : 'الدفع عن طريق العميل',
      },
    };
    await sendPushNotification([providerDeviceId], providerParams, sendToRole);
  }
  if (req.body.progress === 'quote_rejected') {
    const serviceProvider = await User.findOne({ device_id: providerDeviceId });
    const language = serviceProvider.preferred_language;
    providerParams = {
      data: {
        service_id: service._id,
        status: req.body.progress,
        user: 'Service Provider',
        targetScreen: 'RequestStatus',
      },
      notification: {
        title: language == 'en' ? 'Oops!' : 'وجه الفتاة!',
        body:
          language == 'en'
            ? 'Customer has rejected your Qoute'
            : 'رفض العميل عرض أسعارك',
      },
    };
    // await firebaseNotificationToProviderApp(providerParams);
    await sendPushNotification([providerDeviceId], providerParams, sendToRole);
  }

  // For now only admin history maintained
  /* const history = new ServiceHistory({
		service_id: updated_service._id,
		operation: operationConfig.operations.update,
		operator: userId,
		prevObj: prevObj,
		updatedObj: updated_service,
		operation_date: new Date()
	}); */
  //await history.save();
  formatResponse(res, updated_service);
};

export const serviceListForAdmin = async (req, res) => {
  const items = req.query.items ? req.query.items : 10;
  const page = req.query.page ? req.query.page : 1;
  const skip = items * (page - 1);
  const limit = parseInt(items);

  const searchParams = {
    progress: { $ne: 'cancel' },
  };
  const count = await Service.find(searchParams).countDocuments();
  const services = await Service.find(searchParams)
    .sort({ updated_at: 'desc' })
    .populate('category_id')
    .populate('sub_category_id')
    .populate('customer_id', [
      'first_name',
      'last_name',
      'email',
      'mobile_no',
      'addresses',
    ])
    .populate('service_provider_id', [
      'first_name',
      'last_name',
      'email',
      'mobile_no',
      'addresses',
    ])
    .populate('payment_id')
    .populate('review_id')
    .skip(skip)
    .limit(limit)
    .lean();

  if (services.length) {
    services.map((service) => {
      if (service && service.media && service.media.length) {
        service.media.map((image) => {
          image.fileUrl = SERVICE_IMAGE_SERVER_URL + image.fileId;
        });
      }
    });
  }
  const data = {
    total: count,
    pages: count % items === 0 ? count / items : parseInt(count / items) + 1,
    result: services,
  };

  formatResponse(res, data);
};

export const serviceByIdForAdmin = async (req, res) => {
  const service_id = req.params.id;
  const searchParams = {
    _id: service_id,
    //progress: { $ne: 'cancel' },
  };
  const service = await Service.findOne(searchParams)
    .populate('category_id')
    .populate('customer_id', [
      'first_name',
      'last_name',
      'email',
      'mobile_no',
      'addresses',
    ])
    .populate('sub_category_id')
    .populate('service_provider_id', [
      'first_name',
      'last_name',
      'email',
      'mobile_no',
      'addresses',
    ])
    .populate('payment_id')
    .populate('review_id')
    .lean();
  if (service) {
    service.media.map((image) => {
      image.fileUrl = SERVICE_IMAGE_SERVER_URL + image.fileId;
    });
  }
  formatResponse(res, service ? service : {});
};

/**
 * API to get whole list of services as per the query param
 * @param {*} req
 * @param {*} res
 */
export const serviceListForProvider = async (req, res) => {
  // const userId = req.user;

  const progress = req.query.progress;
  // const searchParams = { service_provider_id: userId };
  const searchParams = {};
  if (progress) {
    searchParams.progress = progress;
  }
  const services = await Service.find(searchParams)
    .populate('category_id')
    .populate('sub_category_id')
    .populate('customer_id', [
      'first_name',
      'last_name',
      'email',
      'mobile_no',
      'addresses',
    ])
    .populate('payment_id')
    .populate('review_id')
    .lean();

  if (services.length) {
    services.map((service) => {
      if (service && service.media && service.media.length) {
        service.media.map((image) => {
          image.fileUrl = SERVICE_IMAGE_SERVER_URL + image.fileId;
        });
      }
    });
  }
  formatResponse(res, services);
};

export const serviceByIdForProvider = async (req, res) => {
  if (!req.params.id) {
    const error = new Error('Service not found!');
    error.ar_message = 'الخدمة غير موجودة!';
    error.name = 'DataNotFound';
    return formatResponse(res, error);
  }
  const id = req.params.id;
  const service = await Service.findById(id)
    .populate('category_id')
    .populate('sub_category_id')
    .populate('customer_id', [
      'first_name',
      'last_name',
      'email',
      'mobile_no',
      'addresses',
    ])
    .populate('payment_id')
    .populate('review_id')
    .lean();

  if (service && service.media && service.media.length) {
    service.media.map((image) => {
      if (image) {
        image.fileUrl = SERVICE_IMAGE_SERVER_URL + image.fileId;
      }
    });
  }
  formatResponse(res, service ? service : {});
};

/**
 * Consumer API to get whole list of services including cancelled ones
 * @param {*} req
 * @param {*} res
 */
export const serviceListForUser = async (req, res) => {
  const userId = req.user;
  const searchParams = {
    customer_id: userId,
  };
  const services = await Service.find(searchParams)
    .sort({ created_at: 'DESC' })
    .populate('category_id')
    .populate('sub_category_id')
    .populate('service_provider_id', [
      'first_name',
      'last_name',
      'email',
      'mobile_no',
      'addresses',
    ])
    .populate('review_id')
    .lean();
  if (services && services.length) {
    services.map((service) => {
      service.media.map((image) => {
        image.fileUrl = SERVICE_IMAGE_SERVER_URL + image.fileId;
      });
      service.quote.map((service) => {
        totalAmount += parseInt(service.cost, 10);
      });
      let totalAmount = 0;
      const vatTotal = totalAmount + service.total_service_charge * 0.15;
      service = Object.assign(service, { vatTotal });
      service.total_service_charge += vatTotal;
      service.total_service_charge = service.total_service_charge;
      return service;
    });
    // console.log(services)
  }
  formatResponse(res, services);
};

/**
 * Service provider's requests in different schenario
 * @param {*} req
 * @param {*} res
 */
export const serviceListForProviderByProgress = async (req, res) => {
  const userId = req.user;

  const searchParams = {
    progress: { $nin: ['rejected', 'no_response'] },
  };

  const services = await Service.find({
    $and: [{ service_provider_id: userId }, searchParams],
  })
    .populate('category_id')
    .populate('sub_category_id')
    .populate('service_provider_id', [
      'first_name',
      'last_name',
      'email',
      'mobile_no',
      'addresses',
    ])
    .populate('review_id')
    .sort({ created_at: 'desc' })
    .lean();
  console.log('services : ', services);
  const new_req = [],
    ongoing = [],
    completed = [],
    allRequests = [];
  if (services && services.length) {
    services.map((service) => {
      if (service && service.media && service.media.length) {
        service.media.map((image) => {
          image.fileUrl = SERVICE_IMAGE_SERVER_URL + image.fileId;
        });
      }
      if (service.quote.length) {
        let total = 0;
        service.quote.map((quote) => {
          total = total + Number(quote.cost);
        });
        const service_cost = service.service_cost ? service.service_cost : 0;
        service.total_service_charge = total + Number(service_cost);
      }
      allRequests.push(service);
      if (
        service.progress === 'quote_provided' ||
        service.progress === 'quote_accepted' ||
        service.progress === 'quote_rejected' ||
        service.progress === 'leave_for_the_job' ||
        service.progress === 'ongoing' ||
        service.progress === 'task_done' ||
        service.progress === 'rescheduled' ||
        service.progress == 'journey_cancelled'
      ) {
        ongoing.push(service);
      }
      if (
        service.progress === 'payment_done' ||
        service.progress === 'customer_review' ||
        service.progress === 'provider_review'
      ) {
        completed.push(service);
      }
    });
  }

  // Services which are still not assigned or taken by any provider
  const new_services = await Service.find({
    $and: [
      { progress: { $in: ['new'] } },
      { service_provider_id: { $exists: false } },
      { notified_providers: { $in: [userId] } },
    ],
  })
    .populate('category_id')
    .populate('sub_category_id')
    .sort({ created_at: 'desc' })
    .lean();

  if (new_services && new_services.length) {
    new_services.map((item) => {
      if (item) {
        if (item && item.media && item.media.length) {
          item.media.map((image) => {
            image.fileUrl = SERVICE_IMAGE_SERVER_URL + image.fileId;
          });
        }
        new_req.push(item);
      }
    });
  }

  const request_later_services = await Service.find({
    $and: [
      { progress: { $in: ['queue'] } },
      { service_provider_id: { $exists: false } },
      { notified_providers: { $in: [userId] } },
    ],
  })
    .populate('category_id')
    .populate('sub_category_id')
    .sort({ created_at: 'desc' })
    .lean();

  if (request_later_services && request_later_services.length) {
    request_later_services.map((item) => {
      let scheduled_day_five_am = moment(item.schedule_at).utcOffset(0);
      scheduled_day_five_am.set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      });
      scheduled_day_five_am.add(5, 'hours');
      let current_time = moment(new Date());
      if (item && moment(current_time).isSameOrAfter(scheduled_day_five_am)) {
        item.progress = 'new';
        if (item && item.media && item.media.length) {
          item.media.map((image) => {
            image.fileUrl = SERVICE_IMAGE_SERVER_URL + image.fileId;
          });
        }
        new_req.push(item);
      }
    });
  }
  let merging = allRequests.concat(new_req);
  let all = merging.filter((item, pos) => merging.indexOf(item) === pos);

  function myComparator(a, b) {
    return b.created_at - a.created_at;
  }

  let sorted = all.sort(myComparator);
  const data = { all: sorted, new_req, ongoing, completed };

  formatResponse(res, data);
};

export const serviceListForUserByProgress = async (req, res) => {
  const userId = req.user;
  //TODO : optimise query
  const searchParams = {
    customer_id: userId,
    progress: { $ne: 'cancel' },
  };
  const services = await Service.find(searchParams)
    .populate('category_id')
    .populate('sub_category_id')
    .populate('service_provider_id', [
      'first_name',
      'last_name',
      'email',
      'mobile_no',
      'addresses',
    ])
    .populate('review_id')
    .sort({ created_at: 'desc' })
    .lean();
  const new_req = [],
    accepted = [],
    quote_provided = [],
    quote_accepted = [],
    quote_rejected = [],
    leave_for_the_job = [],
    ongoing = [],
    task_done = [],
    payment_done = [],
    review = [],
    rescheduled = [];

  if (services && services.length) {
    services.map((service) => {
      if (service && service.media && service.media.length) {
        service.media.map((image) => {
          image.fileUrl = SERVICE_IMAGE_SERVER_URL + image.fileId;
        });
      }
      if (service.quote.length) {
        let total = 0;
        service.quote.map((quote) => {
          total = total + Number(quote.cost);
        });
        const service_cost = service.service_cost ? service.service_cost : 0;
        service.total_service_charge = total + Number(service_cost);
      }

      if (service.progress === 'new') {
        new_req.push(service);
      }
      if (service.progress === 'accepted') {
        accepted.push(service);
      }
      if (service.progress === 'quote_provided') {
        quote_provided.push(service);
      }
      if (service.progress === 'quote_accepted') {
        quote_accepted.push(service);
      }
      if (service.progress === 'quote_rejected') {
        quote_rejected.push(service);
      }
      if (service.progress === 'leave_for_the_job') {
        leave_for_the_job.push(service);
      }
      if (service.progress === 'ongoing') {
        ongoing.push(service);
      }
      if (service.progress === 'task_done') {
        task_done.push(service);
      }
      if (service.progress === 'payment_done') {
        payment_done.push(service);
      }
      if (service.progress === 'review') {
        review.push(service);
      }

      if (service.progress === 'rescheduled') {
        rescheduled.push(service);
      }
    });
  }
  const data = {
    new_req,
    accepted,
    quote_provided,
    quote_accepted,
    quote_rejected,
    leave_for_the_job,
    ongoing,
    task_done,
    payment_done,
    review,
  };
  formatResponse(res, data);
};

export const serviceByIdForUser = async (req, res) => {
  console.log('wow');
  const userId = req.user;
  const service_id = req.params.id;
  const searchParams = {
    _id: service_id,
    customer_id: userId,
    progress: { $ne: 'cancel' },
  };
  const service = await Service.findOne(searchParams)
    .populate('customer_id', ['credits', 'first_name', 'last_name'])
    .populate('category_id')
    .populate('sub_category_id')
    .populate('service_provider_id', [
      'first_name',
      'last_name',
      'email',
      'mobile_no',
      'addresses',
    ])
    .populate('review_id')
    .lean();
  const promo = await PromoCode.findOne({ _id: service.promocode_id });
  service.promo = promo;
  if (service && service.media && service.media.length) {
    service.media.map((image) => {
      if (image) {
        image.fileUrl = SERVICE_IMAGE_SERVER_URL + image.fileId;
      }
    });
    if (service.quote && service.quote.length) {
      let total = 0;
      service.quote.map((quote) => {
        if (quote) {
          total = total + Number(quote.cost);
        }
      });
      const service_cost = service.service_cost ? service.service_cost : 0;
      service.total_service_charge = total + Number(service_cost);
      service.vatTotal = service.total_service_charge * 0.15;
      service.total_service_charge += service.vatTotal;
    }
  }
  formatResponse(res, service ? service : {});
};

/**
 * @apiDescription update service request by admin user
 * @param {*} req
 * @param {*} res
 */
export const updateServiceRequestByAdmin = async (req, res) => {
  const operator = req.user;
  const requestId = req.params.id;
  const service = await Service.findById(requestId);
  if (!service) {
    const error = new Error('Service request not found!');
    error.name = 'DataNotFound';
    error.ar_message = 'طلب الخدمة غير موجود!';
    return formatResponse(res, error);
  }
  const prevObj = service.toObject();
  console.log('prevObj===========', prevObj);
  service.address.address = req.body.address.address || service.address.address;
  service.address.city = req.body.address.city || service.address.city;
  service.address.zipcode = req.body.address.zipcode || service.address.zipcode;
  // service.progress_at = new Date();
  const updatedData = await service.save();

  const history = new ServiceHistory({
    service_id: updatedData._id,
    operation: operationConfig.operations.update,
    operator: operator,
    prevObj: prevObj,
    updatedObj: updatedData,
    operation_date: new Date(),
  });
  await history.save();
  formatResponse(res, updatedData);
};

export const deleteSingleServiceByAdmin = async (req, res) => {
  const id = req.params.id;
  const operator = req.user;
  const removedService = await Service.findByIdAndRemove(id);

  if (removedService) {
    const history = new ServiceHistory({
      service_id: removedService._id,
      operation: operationConfig.operations.remove,
      operator: operator,
      prevObj: removedService,
      updatedObj: null,
      operation_date: new Date(),
    });

    await history.save();
  }

  formatResponse(res, removedService ? removedService : {});
};

export const deleteServiceByAdmin = async (req, res) => {
  const ids = req.body.ids;
  const operator = req.user;
  const services = await Service.find({ _id: { $in: ids } });
  if (services.length) {
    const history = services.map((service) => ({
      service_id: service._id,
      operation: operationConfig.operations.remove,
      operator: operator,
      prevObj: service,
      updatedObj: null,
      operation_date: new Date(),
    }));
    await ServiceHistory.insertMany(history);
  }
  await Service.remove({ _id: { $in: ids } });
  formatResponse(res, services);
};

export const getServiceHistory = async (req, res) => {
  const searchData = req.params.id ? { service_id: req.params.id } : {};
  const history = await ServiceHistory.find(searchData)
    .populate('operator', ['first_name', 'last_name', 'email'])
    .populate('prevObj.customer_id', [
      'first_name',
      'last_name',
      'email',
      'mobile_no',
      'addresses',
    ])
    .populate('updatedObj.customer_id', [
      'first_name',
      'last_name',
      'email',
      'mobile_no',
      'addresses',
    ])
    .sort({ operation_date: 'desc' });
  formatResponse(res, history);
};

export const serviceProviderStatistics = async (req, res) => {
  //TODO: add payment
  const userId = req.user;
  const month = Number(req.query.month);
  const year = Number(req.query.year);
  let filter, projection, whereClause;

  const myresult = await ServiceActivity.aggregate([
    { $match: { service_provider_id: userId } },
    { $group: { _id: '$progress', number: { $sum: 1 } } },
  ]);

  var arrkey = [];
  var arrvalue = [];
  //es6
  Object.entries(myresult).forEach(([key, value]) => {
    //console.log(key , value); // key ,value

    arrkey.push(value._id);
    arrvalue.push(value.number);
  });

  var result = {};
  arrkey.forEach((arrkey, i) => (result[arrkey] = arrvalue[i]));
  console.log(result);

  console.log(result.assigned);

  //   var done = 0;
  //   var accepted = 0;
  //   var declined = 0;
  //   var cash_payment_received = 0;
  //   var card_payment_received = 0;
  //   var total_vat_tax = 0;
  //   var pp = 110;
  //   var total_cash_vat_tax = 0;
  //   var total_card_vat_tax = 0;

  var done = typeof result.task_done === 'undefined' ? 0 : result.task_done;
  var accepted = typeof result.accepted === 'undefined' ? 0 : result.accepted;
  var declined = typeof result.rejected === 'undefined' ? 0 : result.rejected;
  var cash_payment_received =
    typeof result.paid === 'undefined' ? 0 : result.paid;
  var card_payment_received =
    typeof result.paid === 'undefined' ? 0 : result.paid;
  var total_vat_tax = typeof result.myVar === 'undefined' ? 0 : result.myVar;
  var total_cash_vat_tax =
    typeof result.myVar === 'undefined' ? 0 : result.myVar;
  var total_card_vat_tax =
    typeof result.myVar === 'undefined' ? 0 : result.myVar;

  let finished =
    (typeof result.task_done === 'undefined' ? 0 : result.task_done) +
    (typeof result.paid === 'undefined' ? 0 : result.paid);

  let cancelled =
    (typeof result.journey_cancelled === 'undefined'
      ? 0
      : result.journey_cancelled) +
    (typeof result.rejected === 'undefined' ? 0 : result.rejected);

  let pending =
    (typeof result.no_response === 'undefined' ? 0 : result.no_response) +
    (typeof result.ongoing === 'undefined' ? 0 : result.ongoing) +
    (typeof result.rescheduled === 'undefined' ? 0 : result.rescheduled);

  if (month && year) {
    filter = [
      {
        $project: {
          progress: 1,
          service_provider_id: 1,
          month: { $month: '$requested_at' },
          year: { $year: '$requested_at' },
        },
      },
      { $match: { service_provider_id: userId, month: month, year: year } },
      { $group: { _id: { progress: '$progress' }, count: { $sum: 1 } } },
    ];
    projection = {
      payment_mode: 1,
      service_provider_id: 1,
      payment_status: 1,
      total_cost: 1,
    };
    const start_date = new Date(year, Number(req.query.month) - 1, 1);
    const end_date = new Date(year, Number(req.query.month) - 1, 31);
    whereClause = {
      service_provider_id: userId,
      updated_at: { $gt: start_date, $lt: end_date },
      payment_status: true,
    };
  } else {
    filter = [
      { $match: { service_provider_id: userId } },
      { $group: { _id: { progress: '$progress' }, count: { $sum: 1 } } },
    ];
    projection = { total_cost: 1, payment_mode: 1, payment_status: 1 };
    whereClause = { service_provider_id: userId, payment_status: true };
  }
  const servicesCount = await Service.aggregate(filter);
  const paymentCount = await Payment.find(whereClause, projection);

  // console.log('paymentCount :', paymentCount);
  servicesCount.map((serviceCount) => {
    done =
      serviceCount._id.progress === 'task_done' ||
      serviceCount._id.progress === 'payment_done' ||
      serviceCount._id.progress === 'provider_review' ||
      serviceCount._id.progress === 'customer_review'
        ? serviceCount.count + done
        : done;

    accepted =
      serviceCount._id.progress === 'accepted' ||
      serviceCount._id.progress === 'quote_provided' ||
      serviceCount._id.progress === 'quote_accepted' ||
      serviceCount._id.progress === 'quote_rejected' ||
      serviceCount._id.progress === 'leave_for_the_job' ||
      serviceCount._id.progress === 'ongoing' ||
      serviceCount._id.progress === 'task_done' ||
      serviceCount._id.progress === 'payment_done' ||
      serviceCount._id.progress === 'provider_review' ||
      serviceCount._id.progress === 'customer_review'
        ? serviceCount.count + accepted
        : accepted;

    declined =
      serviceCount._id.progress === 'rejected'
        ? serviceCount.count + declined
        : declined;
  });
  console.log('paymentCount :', paymentCount);
  paymentCount.map((paymentCount) => {
    cash_payment_received =
      paymentCount.payment_mode === 'cash' &&
      paymentCount.payment_status === true
        ? paymentCount.total_cost + cash_payment_received
        : cash_payment_received;
    card_payment_received =
      paymentCount.payment_mode === 'card' &&
      paymentCount.payment_status === true
        ? paymentCount.total_cost + card_payment_received
        : card_payment_received;
  });
  // console.log('cash_payment_received, card_payment_received :', cash_payment_received, card_payment_received)
  total_cash_vat_tax = cash_payment_received * 0.15;
  total_card_vat_tax = card_payment_received * 0.15;
  cash_payment_received = cash_payment_received + total_cash_vat_tax;
  card_payment_received = card_payment_received + total_card_vat_tax;
  const data = {
    done,
    accepted,
    declined,
    cash_payment_received,
    card_payment_received,
    total_cash_vat_tax,
    total_card_vat_tax,
  };

  let mydata = {
    Finished: finished,
    Cancelled: cancelled,
    Pending: pending,
  };

  formatResponse(res, mydata);
};

/**
 * API posting complaint against a Service
 * @param {*} req
 * @param {*} res
 */
export const addComplainForService = async (req, res) => {
  const serviceId = req.body.service_id;
  const service = await Service.findById(serviceId).populate('review_id');
  if (!service) {
    const error = new Error('Service not found!');
    error.ar_message = 'الخدمة غير موجودة!';
    error.name = 'DataNotFound';
    return formatResponse(res, error);
  }
  service.set({
    user_complain: req.body.user_complain,
    user_complain_date: new Date(),
  });
  await service.save();
  formatResponse(res, service);
};

export const addComplainResolution = async (req, res) => {
  const serviceId = req.body.service_id;
  const service = await Service.findById(serviceId);
  if (!service) {
    const error = new Error('Service not found!');
    error.ar_message = 'الخدمة غير موجودة!';
    error.name = 'DataNotFound';
    return formatResponse(res, error);
  }
  if (service.user_complain) {
    service.set({
      complain_resolution: req.body.complain_resolution,
      complain_resolution_date: new Date(),
    });
    await service.save();
  }
  formatResponse(res, service);
};

/**
 * Customer cancels the newly created request with the cancellation_commment
 * @param {*} req
 * @param {*} res
 */
export const rejectNewServiceByUser = async (req, res) => {
  const userId = req.user;
  const requestId = req.params.service_id;
  const service = await Service.findOne({
    _id: requestId,
    customer_id: userId,
  });

  if (!service) {
    const error = new Error('Service request not found!');
    error.ar_message = 'طلب الخدمة غير موجود!';
    error.name = 'DataNotFound';
    return formatResponse(res, error);
    // return formatResponse(res, { message: 'Service request not found!', ar_name: 'طلب خدمة غير موجود' });
  }
  if (service && service.progress === 'cancel') {
    const error = new Error('Request already cancelled');
    error.ar_message = 'تم إلغاء الطلب بالفعل';
    error.name = 'DataNotFound';
    return formatResponse(res, error);
  }

  service.set({
    progress: req.body.progress,
    progress_at: new Date(),
    cancellation_commment_by_user: req.body.comment,
  });
  await service.save();

  formatResponse(res, { message: 'Request cancelled!' });
};

export const addRequest = async (req, res) => {
  const userId = req.user;
  const promoId = req.query.promo;
  req.body.customer_id = userId;
  const providers = await findServiceProviders(req);
  const media = req.body.media;
  if (media && media.length) {
    media.map(async (item) => {
      console.log('item-----', item);

      const x = await uploadHelper.uploadServiceFile.array('service_file', 5);
      const image = `${item.fieldName.replace('_', '-')}s/${x.key}`;
      console.log('IMAGE----------', x);

      let data = { image };
    });
  }
  const roleToSend = constants.SERVICE_PROVIDER;
  if (!providers.length) {
    const error = new Error('Service providers not available in your area!');
    error.ar_message = 'مزودي الخدمة غير متوفرين في منطقتك!';
    error.name = 'DataNotFound';
    return formatResponse(res, error);
  }

  if (promoId) {
    const code = await PromoCode.findById(promoId);
    if (!code) {
      const error = new Error('Invalid Promo-code!');
      error.ar_message = 'الرمز الترويجي غير صالح!';
      error.name = 'DataNotFound';
      return formatResponse(res, error);
    }
    req.body.promocode_id = code._id;
    req.body.isPromoApplied = true;
    req.body.promo_amount = code.amount;
  }
  const date = req.body.request_date;
  const time = req.body.request_time;
  // const {date, time} = req.body;

  req.body.schedule_at =
    date && time
      ? moment(`${date} ${time}`).format('MM/DD/YYYY h:mm a')
      : moment();

  const createdRequest = await Service.create(req.body);
  const serviceActivityData = providers.map((provider) => {
    if (provider) {
      return {
        service_id: createdRequest._id,
        category_id: req.body.category_id,
        sub_category_id: req.body.sub_category_id,
        customer_id: userId,
        service_provider_id: provider._id,
        progress: 'assigned',
      };
    }
  });
  await ServiceActivity.insertMany(serviceActivityData);
  console.log('providersIDs------------', providers.userId);

  const deviceIds = providers.map((provider) => provider.device_id);
  await providers.map((provider) =>
    createdRequest.notified_providers.push(provider._id)
  );

  console.log('deviceIds~~~~~~~~', deviceIds);

  // let payload = {
  // 	notification: {
  // 		title: 'New Service Request',
  // 		body: 'Please update service request'
  // 	},
  // 	data: {
  // 		requestId: createdRequest._id,
  // 		status: 'new',
  // 		user: 'Service Provider',
  // 		targetScreen: 'Dashboard'
  // 	}
  // };
  // await createdRequest.save();
  // await sendPushNotificationToMultiple(deviceIds, payload, roleToSend);

  // For now only admin history maintained
  /* const history = new ServiceHistory({
		service_id: createdRequest._id,
		operation: operationConfig.operations.add,
		operator: userId,
		prevObj: null,
		updatedObj: createdRequest,
		operation_date: new Date()
	});
	await history.save(); */
  formatResponse(res, createdRequest);
};
