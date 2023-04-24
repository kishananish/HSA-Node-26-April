import formatResponse from '../../utils/formatResponse';
import Review from '../models/Review';
import Payment from '../models/Payment';
import ActiveTime from '../models/ActiveTime';
import Services from '../models/Service';
import moment from 'moment';
import ServiceActivity from '../models/ServiceActivity';

export const serviceRequest = async (req, res) => {
  const startDate = req.query.start_date;
  const endDate = req.query.end_date;
  const user_id = req.query.user_id;

  const category_id = req.query.category_id;

  let searchData = {
    progress: { $in: ['rejected', 'accepted', 'assigned'] },
  };
  if (startDate) {
    searchData.created_at = {
      $gte: new Date(startDate),
    };
  }
  if (startDate && endDate) {
    searchData.created_at = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  if (user_id) {
    searchData.service_provider_id = user_id;
  }

  if (category_id) {
    searchData.category_id = category_id;
  }

  const services = await ServiceActivity.aggregate([
    { $match: searchData },
    {
      $group: {
        _id: {
          service_provider_id: '$service_provider_id',
          category_id: '$category_id',
          progress: '$progress',
        },
        total: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        provider_id: '$_id.service_provider_id',
        progress: '$_id.progress',
        total: '$total',
        category_id: '$_id.category_id',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'provider_id',
        foreignField: '_id',
        as: 'provider',
      },
    },
    {
      $lookup: {
        from: 'categories',
        localField: 'category_id',
        foreignField: '_id',
        as: 'category',
      },
    },
    {
      $unwind: {
        path: '$provider',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: '$category',
        preserveNullAndEmptyArrays: true,
      },
    },
  ]);

  const uniqueProviders = services
    .map((service) => service.provider_id)
    .filter((value, index, self) => self.indexOf(value) === index);

  const newServices = [];
  services.forEach((service) => {
    let userData = {};
    userData.service_provider_id = service.provider_id;
    userData.date_of_joining = service.provider_id.created_at;
    userData.first_name = service.provider.first_name;
    userData.last_name = service.provider.last_name;
    userData.area_assigned = service.provider.area_assigned || 'NA';
    userData.category_name = service.provider_id.name;
    userData.total = service.total;
    userData.progress = service.progress;

    newServices.push(userData);
  });

  uniqueProviders.forEach((provider) => {
    newServices.forEach((service) => {
      if (provider === service.service_provider_id) {
        service.total_service_assigned =
          service.progress === 'assigned' ? service.total : 0;
        service.total_service_accepted =
          service.progress === 'accepted' ? service.total : 0;
        service.total_service_rejected =
          service.progress === 'rejected' ? service.total : 0;
      }
      delete service.progress;
      delete service.total;
    });
  });

  for (var i = 0; i <= newServices.length; i++) {
    for (var j = 1; j <= newServices.length; j++) {
      if (
        newServices[i].service_provider_id ===
        newServices[j].service_provider_id
      ) {
        newServices[i].total_service_assigned =
          newServices[i].total_service_assigned +
          newServices[j].total_service_assigned;
        newServices[i].total_service_accepted =
          newServices[i].total_service_accepted +
          newServices[j].total_service_accepted;
        newServices[i].total_service_rejected =
          newServices[i].total_service_rejected +
          newServices[j].total_service_rejected;
      }
      break;
    }
    break;
  }

  formatResponse(res, newServices[i]);
};

export const getRating = async (req, res) => {
  const startDate = req.query.start_date;
  const endDate = req.query.end_date;
  const user_id = req.query.user_id;
  const user_type = req.query.user_type;

  let searchData = {
    service_provider_id: { $exists: true },
    user_id: { $exists: true },
    service_id: { $exists: true },
  };
  if (startDate) {
    searchData.created_at = {
      $gte: startDate,
    };
  }
  if (startDate && endDate) {
    searchData.created_at = {
      $gte: startDate,
      $lte: endDate,
    };
  }

  if (user_type === 'service_provider' && user_id) {
    searchData.$and = [
      { service_provider_id: { $exists: true } },
      { service_provider_id: user_id },
    ];
    searchData.user_id = { $exists: true };
    searchData.service_id = { $exists: true };
  }
  if (user_type === 'user' && user_id) {
    searchData.service_provider_id = { $exists: true };
    searchData.$and = [{ user_id: { $exists: true } }, { user_id: user_id }];
    searchData.service_id = { $exists: true };
    console.log('>>>>>>>>>>>>searchData', searchData);
  }
  const ratings = await Review.find(searchData)
    .populate({
      path: 'user_id',
      model: 'Customer',
      select: { first_name: 1, last_name: 1, created_at: 1 },
    })
    .populate({
      path: 'service_provider_id',
      model: 'User',
      select: { first_name: 1, last_name: 1, created_at: 1 },
    })
    .populate({
      path: 'service_id',
      model: 'Service',
      select: { created_at: 1, category_id: 1 },
      populate: {
        path: 'category_id',
        model: 'Category',
        select: { name: 1 },
      },
    })
    .lean();
  console.log('>>>>>>>>>>>>Rating', ratings);
  const result = [];
  ratings.forEach((rating) => {
    const provider = {
      user_id:
        rating && rating.service_provider_id && rating.service_provider_id._id
          ? rating.service_provider_id._id
          : '',
      service_id:
        rating && rating.service_id && rating.service_id._id
          ? rating.service_id._id
          : '',
      date_of_joining:
        rating && rating.service_provider_id
          ? rating.service_provider_id.created_at
          : '',
      first_name:
        rating &&
        rating.service_provider_id &&
        rating.service_provider_id.first_name
          ? rating.service_provider_id.first_name
          : '',
      last_name:
        rating &&
        rating.service_provider_id &&
        rating.service_provider_id.last_name
          ? rating.service_provider_id.last_name
          : '',
      category_name:
        rating && rating.service_id && rating.service_id.category_id
          ? rating.service_id.category_id.name
          : '',
      service_date:
        rating && rating.service_id ? rating.service_id.created_at : '',
      rating:
        rating && rating.service_provider_rating
          ? rating.service_provider_rating
          : 0,
      user_type: 'Service Provider',
    };

    const user = {
      user_id: rating && rating.user_id ? rating.user_id._id : '',
      service_id: rating && rating.service_id ? rating.service_id._id : '',
      date_of_joining:
        rating && rating.user_id ? rating.user_id.created_at : '',
      first_name: rating && rating.user_id ? rating.user_id.first_name : '',
      last_name: rating && rating.user_id ? rating.user_id.last_name : '',
      category_name:
        rating && rating.service_id && rating.service_id.category_id
          ? rating.service_id.category_id.name
          : '',
      service_date:
        rating && rating.service_id ? rating.service_id.created_at : '',
      rating: rating.user_rating,
      user_type: 'Customer',
    };

    if (user_type === 'user') result.push(user);
    if (user_type === 'service_provider') result.push(provider);
    if (!user_type) result.push(provider, user);
  });
  formatResponse(res, result);
};

export const totalEarning = async (req, res) => {
  const searchData = {};
  const userSearch = {};
  const serviceSearch = {};
  const start_date = req.query.start_date;
  const end_date = req.query.end_date;
  const service_provider_id = req.query.service_provider_id;
  const area_assigned = req.query.area_assigned;
  const payment_mode = req.query.payment_mode;

  //return;
  if (start_date) {
    searchData.created_at = {
      $gte: start_date,
    };
  }
  if (start_date && end_date) {
    searchData.created_at = {
      $gte: start_date,
      $lte: end_date,
    };
  }
  if (service_provider_id) {
    searchData.service_provider_id = service_provider_id;
  }
  if (area_assigned) {
    userSearch.area_assigned = area_assigned;
  }
  if (payment_mode) {
    searchData.payment_mode = payment_mode;
  }

  console.log('>>>>>>>searchDatakkk', searchData);
  serviceSearch.service_id = { $ne: null };

  const payments = await Payment.find(searchData).populate({
    path: 'service_id',
    model: 'Service',
    select: { service_provider_id: 1 },
    populate: {
      path: 'service_provider_id',
      //  match: userSearch,
      model: 'User',
    },
  });

  let userArray = [];
  payments.forEach((payment) => {
    console.log('>>>>>>>>>>', payment.service_id.service_provider_id);
    if (
      payment.service_provider_id &&
      payment.service_id &&
      payment.service_id._id
    ) {
      console.log('inside if>>>>>>>>>>>>>>>');
      let found = userArray.some((el) => {
        console.log(el);

        return el.service_provider_id === payment.service_provider_id;
      });

      if (!found) {
        userArray.push({
          service_provider_id: payment.service_id._id,
          date_of_joining: payment.service_id.service_provider_id.created_at,
          first_name: payment.service_id.service_provider_id.first_name,
          last_name: payment.service_id.service_provider_id.last_name,
          area_assigned:
            payment.service_id.service_provider_id.area_assigned || 'NA',
          payment_mode: payment.payment_mode,
          total_amount_paid: payment.total_cost,
          total_cost: 0,
          total_amount_deposit: payment.total_cost,
          total_amount_pending: 0,
        });
      }
    }
  });

  userArray.forEach((user) => {
    payments.forEach((payment) => {
      if (
        payment.service_provider_id &&
        payment.service_id &&
        payment.service_id.service_provider_id
      ) {
        if (user.service_provider_id === payment.service_provider_id) {
          user.total_amount_paid += payment.total_amount_paid;
          user.total_cost += payment.total_cost;
          user.total_amount_deposit += payment.total_amount_paid;
          user.total_amount_pending += payment.total_amount_pending;
        }
      }
    });
  });

  formatResponse(res, userArray);
};

export const activeTimeReport = async (req, res) => {
  const startDate = req.query.start_date;
  const endDate = req.query.end_date;
  const user_id = req.query.user_id;
  //const category_id = req.query.category_id;

  let searchData = {};

  if (startDate) {
    searchData.created_at = {
      $gte: startDate,
    };
  }
  if (startDate && endDate) {
    searchData.created_at = {
      $gte: startDate,
      $lte: endDate,
    };
  }
  if (user_id) {
    searchData.user_id = user_id;
  }
  //  if (category_id) {
  //  	searchData.category_id = category_id;
  //  }
  console.log('>>>>>>serachData', searchData);
  const activeTimes = await ActiveTime.find(searchData)
    .populate({
      path: 'user_id',
      model: 'User',
      select: {
        first_name: 1,
        last_name: 1,
        area_assigned: 1,
        created_at: 1,
        category_id: 1,
      },
      populate: { path: 'role', model: 'Role' },
      populate: { path: 'category_id', model: 'Category' },
    })
    .lean();

  let act_app_time = 0;
  let act_work_time = 0;
  let act_time1 = [];
  let scope_user = '';
  let scope_user_array = [];
  let active_data = '';
  activeTimes.forEach((service) => {
    let service_created_date = moment(service.created_at); // task start on
    let service_active_time = moment(service.time);
    let service_update_time = moment(service.updated_at);

    let active_time_work = moment.duration(
      service_created_date.diff(service_active_time)
    );
    let active_time_app = moment.duration(
      service_created_date.diff(service_update_time)
    );
    service.active_time_of_work = active_time_work.asSeconds();
    service.active_time_on_app = active_time_app.asSeconds();
    if (service.user_id) {
      if (
        !scope_user_array.includes(service.user_id._id) &&
        service.user_id._id != ''
      ) {
        scope_user = service.user_id._id;
        scope_user_array.push(scope_user);
      }
    }
  });

  if (scope_user_array.length > 0) {
    scope_user_array.forEach((service) => {
      if (activeTimes.length > 0) {
        activeTimes.forEach((service1) => {
          if (
            service1 &&
            service1.user_id &&
            service1.user_id._id == service &&
            act_app_time == 0
          ) {
            act_app_time = service1.active_time_of_work;
            act_work_time = service1.active_time_of_work;
          } else if (
            service1 &&
            service1.user_id &&
            service1.user_id._id == service &&
            act_app_time != 0
          ) {
            act_app_time = act_app_time + service1.active_time_of_work;
            act_work_time = act_work_time + service1.active_time_of_work;
          }
        });
      }
      if (activeTimes.length > 0) {
        activeTimes.forEach((service1) => {
          if (service1 && service1.user_id && service1.user_id._id == service) {
            service1.act_app_time = act_app_time;
            service1.act_work_time = act_work_time;
            active_data = service1;
          }
        });
      }
      act_time1.push(active_data);
    });
  }

  const result = act_time1.map((data) => {
    return {
      service_provider_id: data.user_id._id,
      first_name: data.user_id.first_name,
      last_name: data.user_id.last_name,
      date_of_joining: data.user_id.created_at,
      location: data.user_id.area_assigned || 'NA',
      category_name:
        data.user_id && data.user_id.category_id
          ? data.user_id.category_id.name
          : 'NA',
      active_time_of_work: Math.abs(data.active_time_of_work),
      active_time_on_app: Math.abs(data.act_work_time),
    };
  });
  formatResponse(res, result);
};

export const responseTimeReport = async (req, res) => {
  const startDate = req.query.start_date;
  const endDate = req.query.end_date;
  const user_id = req.query.user_id;

  let searchData = {
    progress: { $nin: ['assigned', 'new', 'cancel'] },
  };

  if (startDate) {
    searchData.created_at = {
      $gte: new Date(startDate),
    };
  }
  if (startDate && endDate) {
    searchData.created_at = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }
  if (user_id) {
    searchData.service_provider_id = user_id;
  }

  const responseTimes = await Services.aggregate([
    { $match: searchData },
    {
      $project: {
        service_provider_id: 1,
        duration: {
          $divide: [{ $subtract: ['$respond_at', '$created_at'] }, 3600000],
        },
      },
    },
    {
      $group: {
        _id: '$service_provider_id',
        average_duration: { $avg: '$duration' },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'provider',
      },
    },
    { $unwind: '$provider' },
    {
      $project: {
        service_provider_id: '$provider._id',
        date_of_joining: '$provider.created_at',
        first_name: '$provider.first_name',
        last_name: '$provider.last_name',
        location: '$provider.area_assigned',
        response_time: '$average_duration',
      },
    },
  ]);

  formatResponse(res, responseTimes);
};
