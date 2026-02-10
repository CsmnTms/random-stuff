// Not exactly a controller but it kinda controls errors so whatever maybe think this more

import {AppError} from '../utils/appError.js';

export function errorHandler(error, request, response, next) {
  //console.log(error.stack);
  
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, response);
  } else if (process.env.NODE_ENV === 'production') {
    let handledError = { ...error };

    if (error.name === 'CastError') { handledError = handleCastErrorDB(error); }
    if (error.code === 11000) { handledError = handleDuplicateFieldsDB(error); }
    if (error.name === 'ValidationError') { handledError = handleValidationErrorDB(error); }
    
    sendErrorProd(handledError, response);
  }
}

const sendErrorDev = (error, response) => {
  response.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    error: error,
    stack: error.stack,
  });
};

const sendErrorProd = (error, response) => {
  // Operational, trusted error: send message to client
  if (error.isOperational) {
    return response.status(error.statusCode).json({
      status: error.status,
      message: error.message
    });

  // Programming or other unknown error: don't leak error details
  } else {
    // Log error to console
    console.error('ERROR 💥', error);
    
    response.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }
};

const handleCastErrorDB = (error) => { 
  const message = `Invalid ${error.path}: ${error.value}.`;
  return new AppError(message, 400);
}

const handleDuplicateFieldsDB = (error) => {
  const value = error.errmsg.match(/(["'])(\\?.)*?\1/)[0];

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (error) => {
  const errors = Object.values(error.errors).map(el => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};
