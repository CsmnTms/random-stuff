export const catchAsync = (fn) => {
  return (request, response, next) => {
    fn(request, response, next).catch(next); 
    // fn(request, response, next).catch(err => next(err)); // same as above
  }
};