'use strict';

import formatResponse from '../../utils/formatResponse';
import config from '../../config/operationConfig';
import Complaint from '../models/Complaint';
import ComplaintHistory from '../models/ComplaintHistory';
import logger from '../../utils/logger';


export const getComplaint = async(req, res) => {
    const complaint = await Complaint.find({});
    formatResponse(res, complaint);
};


export const add = async (req, res) => {
    const operator = req.user;

    const newComplaint = new Complaint({
        user_id:operator,
        request_id:req.params.id,
        status:req.body.status,
        complaint_msg: req.body.complaint_msg,
        created_at: new Date(),
        updated_at: null
    });
    const complaint = await newComplaint.save();

    const history = new ComplaintHistory({
        complaint_id: complaint._id,
        operation: config.operations.add,
        operator: operator,
        prevObj: null,
        updatedObj: complaint,
        operation_date: new Date()
    });

    await history.save();

    formatResponse(res, complaint);

};


export const update = async (req, res) => {

    const operator = req.user;
    const id = req.params.id;
    const complaint = await Complaint.findById(id);
	

    if(!complaint) {
        let error = new Error('Complaint not found!');
        error.name = 'NotFound';
        error.ar_message='لم يتم العثور على شكوى!';
        return formatResponse(res, error);
    } else {
        const origObj = new Complaint({
            _id: complaint._id,
            user_id:complaint.operator,
            request_id:complaint.request_id,
            status:complaint.status,
            complaint_msg: complaint.complaint_msg,
            created_at: complaint.created_at,
            updated_at: complaint.updated_at
        });

        complaint.complaint_msg = req.body.complaint_msg || complaint.complaint_msg;
        complaint.updated_at = new Date();

        await complaint.save();
		
        const history = new ComplaintHistory({
            complaint_id: complaint._id,
            operation: config.operations.update,
            operator: operator,
            prevObj: origObj,
            updatedObj: complaint,
            operation_date: new Date()
        });

        await history.save();
        return formatResponse(res, complaint);

    }
};
