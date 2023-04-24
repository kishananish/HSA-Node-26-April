import mongoose from 'mongoose';
import shortid from 'shortid';
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

const Schema = mongoose.Schema;

const cardSchema = new Schema({
    _id: { type: String, 'default': shortid.generate },
    user_id: {
        type: String,
        ref: 'Customer'
    },
    card_name: { type: String, trim: true },
    bank_name: { type: String, trim: true },
    card_number: {
        type: String,
        trim: true,
        maxlength: 19,
        minlength: 8,
        required: [true, 'Card number is required!']
    },
    expiry_date: { type: String, required: [true, 'Expiry month/year is required!'] },
    // expiry_month: { type: String, required: [true, 'Expiry month is required!'] },
    // expiry_year: { type: String, required: [true, 'Expiry year is required!'] },
    cvv: {
        type: String,
        trim: true,
        minlength: 3,
        required: [true, 'CVV is invalid!']
    },
    is_default: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Card = mongoose.model('Card', cardSchema);

export default Card;
