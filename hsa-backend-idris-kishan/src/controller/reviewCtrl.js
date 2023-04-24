'use strict';

import formatResponse from '../../utils/formatResponse';
import Review from '../models/Review';
import Service from '../models/Service';
import User from '../models/User';


export const giveReviewToProvider = async (req, res) => {
    const userId = req.user; // customerID
    const serviceId = req.body.service_id;

    const service = await Service.findById(serviceId);
    const review = await Review.findOne({ service_id: serviceId });

    if (!service || !review) {
        const error = new Error();
        error.name = 'DataNotFound';
        error.message = 'Service request not found!';
        error.ar_message = 'طلب خدمة غير موجود';
        return formatResponse(res, error);
    } else {
        if (!req.body.service_provider_rating || !req.body.service_provider_comment) {
            const error = new Error();
            error.name = 'CantOperate';
            error.message = 'Please provide feedback!';
            error.ar_message = 'يرجى تقديم ردود الفعل';
            return formatResponse(res, error);
        }
        review.user_id = userId;
        review.service_provider_id = service.service_provider_id;
        review.service_provider_rating = req.body.service_provider_rating;
        review.service_provider_comment = req.body.service_provider_comment;
        await review.save();


        service.set({ review_id: review._id, progress: 'customer_review', progress_at: new Date() });
        const updatedService = await service.save();

        // update service_provider review Count
        const service_provider_id = service.service_provider_id;
        const averageReviewCount = await Review.getAverageCount(service_provider_id);
        const user_ratings = averageReviewCount[0].average_user_ratings;
        const average_user_ratings = Math.round(user_ratings * 10) / 10;
        await User.findByIdAndUpdate({ _id: service_provider_id }, { $set: { rating: average_user_ratings } });
        formatResponse(res, updatedService);
    }

};

export const giveReviewToCustomer = async (req, res) => {
    const userId = req.user; // providerID
    const serviceId = req.body.service_id;
    const service = await Service.findById(serviceId);
    const review = await Review.findOne({ service_id: serviceId });

    if (!service || !review) {
        const error = new Error();
        error.name = 'DataNotFound';
        error.message = 'Service request not found!';
        error.ar_message = 'طلب خدمة غير موجود';
        return formatResponse(res, error);
    } else {
        if (!req.body.user_rating || !req.body.user_comment) {
            const error = new Error();
            error.name = 'CantOperate';
            error.message = 'Please provide feedback!';
            error.ar_message = 'يرجى تقديم ردود الفعل';
            return formatResponse(res, error);
        }
        review.service_provider_id = userId;
        review.user_id = service.customer_id;
        review.user_rating = req.body.user_rating;
        review.user_comment = req.body.user_comment;
        await review.save();
    }
    service.set({ review_id: review._id, progress: 'provider_review', progress_at: new Date() });
    const updatedService = await service.save();
    formatResponse(res, updatedService);
};
