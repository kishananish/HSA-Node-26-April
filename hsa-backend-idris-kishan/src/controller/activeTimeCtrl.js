'use strict';

import formatResponse from '../../utils/formatResponse';
import ActiveTime from '../models/ActiveTime';

export const addActiveTime = async (req, res) => {
    req.body.user_id = req.user;
    const activeTime = await ActiveTime.create(req.body);
    formatResponse(res, activeTime);
};