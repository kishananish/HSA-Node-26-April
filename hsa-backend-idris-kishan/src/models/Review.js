import mongoose from 'mongoose';
import shortid from 'shortid';
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
import formatResponse from '../../utils/formatResponse';

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    _id: { type: String, 'default': shortid.generate },
    service_id: {
        type: String,
        ref: 'Service',
        unique: true,
        required: [true, 'Service reference is required!']
    },
    user_id: {
        type: String,
        ref: 'Customer'
    },
    service_provider_id: {
        type: String,
        ref: 'User'
    },
    user_rating: { type: Number },
    service_provider_rating: { type: Number },
    user_comment: { type: String },
    service_provider_comment: { type: String },
},
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    });

reviewSchema.statics = {

    async getAverageCount(id) {
        let review;
        if (shortid.isValid(id)) {
            review = await this.aggregate([{ $group: { _id: id, average_user_ratings: { $avg: '$user_rating' } } }]).exec();
            return review;
        } else {
            const error = new Error('ServiceId not valid!');
            error.name = 'NotFound';
            return formatResponse(error);
        }
    },
};


const Review = mongoose.model('Review', reviewSchema);

export default Review;
