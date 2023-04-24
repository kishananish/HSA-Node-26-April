import ComplaintResolution from '../models/ComplaintResolution';
import formatResponse from '../../utils/formatResponse';

export const addResolution = async (req, res) => {

    const newComplaintResolution = new ComplaintResolution({
        complaintId: req.body.complaintId,
        adminId: req.body.adminId,
        message: req.body.message,
        created_at: new Date(),
        updated_at: null
    });
    const resolution = await newComplaintResolution.save();
    formatResponse(res, resolution);
};

export const updateResolution = async (req, res) => {

    const id = req.params.id;
    const resolution = await ComplaintResolution.findById(id);

    if (!resolution) {
        let error = new Error('Complaint Resolution not found!');
        error.ar_message = 'قرار الشكوى غير موجود!';
        error.name = 'NotFound';
        return formatResponse(res, error);
    } else {
        // const origObj = new Category({
        // 	complaintId: resolution.complaintId,
        // 	adminId: resolution.adminId,
        // 	message: resolution.message,
        // 	created_at: resolution.created_at,
        // 	updated_at: new Date(),
        // });

        resolution.adminId = req.body.adminId || resolution.adminId;
        resolution.message = req.body.message === '' ? resolution.message : req.body.message;
        resolution.updated_at = new Date();

        await resolution.save();

        return formatResponse(res, resolution);

    }
};


