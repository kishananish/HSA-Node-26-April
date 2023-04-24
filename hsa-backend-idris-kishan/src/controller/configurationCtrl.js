'use strict';
import Configuration from '../models/Configuration';
import formatResponse from '../../utils/formatResponse';

export const getConfiguration = async (req, res) => {
    const configuration = await Configuration.findOne();
    formatResponse(res, configuration);
};

export const addConfiguration = async (req, res) => {
    req.body.range = req.body.range * 1000;
    const findObject = await Configuration.find().countDocuments();
    switch (findObject) {
        case 0: {
            const newConfiguration = new Configuration({
                //range: req.body.range,
                range: req.body.range ,
                credits: req.body.credits,
            });
            const configuration = await newConfiguration.save();
            configuration.message = 'Configuration created';
            formatResponse(res, configuration);
            break;
        }

        case 1: {
            const updateField = (req.body);
            const oldConfiguration = await Configuration.findOne();
            const updateConfiguration = Object.assign(oldConfiguration, updateField);
            const updatedConfiguration = await updateConfiguration.save();
            updatedConfiguration.message = 'Configuration updated';
            formatResponse(res, updatedConfiguration);
            break;
        }

        default: {
            let error = new Error('Configuration data not found!');
            error.ar_message = 'لم يتم العثور على بيانات التكوين!';
            error.name = 'DataNotFound';
            return formatResponse(res, error);
        }

    }

};


