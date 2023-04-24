import mongoose from 'mongoose';
import shortid from 'shortid';
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

const Schema = mongoose.Schema;

const activeTimeSchema = new Schema({
    _id: { type: String, 'default': shortid.generate },
    user_id: {
        type: String,
        ref: 'User'
    },
    category_id: {
        type: String,
        ref: 'Category'
    },
    status: { type: String, enum: ['active','inactive'] },
    time: Date
},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const ActiveTime = mongoose.model('ActiveTime', activeTimeSchema);

export default ActiveTime;
