import formatResponse from '../../utils/formatResponse';

/*
  Catch Errors Handler
  With async/await, you need some way to catch errors
  Instead of using try{} catch(e) {} in each controller, we wrap the function in
  catchErrors(), catch and errors they throw, and pass it along to our express middleware with next()
*/

exports.catchErrors = (fn) => {
    return function (req, res, next) {
        return fn(req, res, next).catch(next);
    };
};

/*
  Not Found Error Handler
  If we hit a route that is not found, we mark it as 404 and pass it along to the next error handler to display
*/
exports.notFound = (req, res, next) => {
    const err = new Error('Not Found');
    err.name = 'NotFound';
    err.status = 404;
    next(err);
};

/*
  MongoDB Validation Error Handler
  Detect if there are mongodb validation errors
*/

exports.validationErrors = (err, req, res, next) => {
    if (err.name === 'MongoError' && err.code === 11000) {
        const error = new Error(err);
        error.name = 'ValidationError';
        return formatResponse(res, error);
    }
    next(err);
};


/*
  Development Error Handler
*/

exports.developmentErrors = (err, req, res, next) => { // eslint-disable-line no-unused-vars
    // res.status(err.status || 500).send(err);
    formatResponse(res, err);
};


/*
  Production Error Hanlder
  No stacktraces are leaked to user
*/
exports.productionErrors = (err, req, res, next) => { // eslint-disable-line no-unused-vars
    res.status(err.status || 500).send({
        status: 'error',
        message: err.message,
        error: {}
    });
};
