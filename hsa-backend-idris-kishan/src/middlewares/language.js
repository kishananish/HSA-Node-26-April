import config from '../../config/config';

export const language = async (req, res, next) => {
    console.log('user is ------------------->>', req.user);
    next();
};

