import BaseSchema from '../../core/api/base.model';
import validations from './pub-sub.validation';
import mongoose from 'mongoose';

const PubSubModel = new BaseSchema({
    deleted: {
        type: Boolean,
        select: false,
        default: false,
    }
}, {
    timestamps: true
});

PubSubModel.statics.validations = (type, body) => {
    return validations[type](body);
};

/**
 * @typedef PubSubModel
 * */
export const Subscribe = mongoose.model('Subscribe', PubSubModel);
