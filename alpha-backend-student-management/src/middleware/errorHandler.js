
// Handles validation errors
const handleValidationError = (err) => {
  return {
    statusCode: 400,
    message: err.message || 'Invalid input data provided.',
    details: err.details || null 
  };
};

const handleZodError = (err) => {
  const formattedErrors = {};

  err.issues.forEach((issue) => {
    const fieldName = issue.path.join('.'); 
    formattedErrors[fieldName] = issue.message;
  });

  return {
    statusCode: 400,
    message: 'Validation failed.',
    details: formattedErrors
  };
};

// Handles Database Unique Constraint Violations
const handleDuplicateFieldsError = (err) => {
  return {
    statusCode: 409, // Conflict
    message: err.message || 'A record with this information already exists.',
    details:err.details || null
  };
};

// Handles missing resources
const handleNotFoundError = (err) => {
  return {
    statusCode: 404,
    message: err.message || 'The requested resource could not be found.',
    details:err.details || null
  };
};



const globalErrorHandler = (err, req, res, next) => {
    console.log(err)
  let finalResponse = {
    statusCode: 500,
    message: 'Something went very wrong on our end.'
  };

  if (err.name === 'ValidationError' || err.isValidatorError) {
    finalResponse = handleValidationError(err);
  } 
  else if (err.code === 11000 || err.code === 23505) { 
    finalResponse = handleDuplicateFieldsError(err);
  } 
  else if (err.name === 'CastError' || err.notFound) {
    finalResponse = handleNotFoundError(err);
  }
  else if (err.name === 'ZodError') {
    finalResponse = handleZodError(err);
  }

  return res.status(finalResponse.statusCode).json({
    success: false,
    message: finalResponse.message,
    details: finalResponse.details
  });
};

export default globalErrorHandler;