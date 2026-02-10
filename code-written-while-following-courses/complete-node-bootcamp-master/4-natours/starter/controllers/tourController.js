import Tour from '../models/tourModel.js';
import { APIFeatures } from '../utils/apiFeatures.js';
import { AppError } from '../utils/appError.js';

export function aliasTopTours(request, response, next) {
  request._parsedUrl.query = request._parsedUrl.query || {};
  request._parsedUrl.query.sort = '-ratingsAverage,price';
  request._parsedUrl.query.limit = '5';
  request._parsedUrl.query.fields = 'name,price,ratingsAverage,difficulty';

  console.log(request._parsedUrl.query.sort);

  next();
}

export async function getAllToursAsync(request, response, next) {
    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), request._parsedUrl.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;

    // SEND RESPONSE
    response.status(200).json({
      status: 'success',
      resultCount: tours.length,
      data: {
        tours
      },
    });
}

export async function getTourAsync(request, response, next) {
    const tour = await Tour.findById(request.params.id);
    // Tour.findOne({ _id: request.params.id }); // equivalent to the above

    if (!tour) {
      return next(new AppError(`No tour found with ID ${request.params.id}`, 404));
    }

    response.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
}

export async function createTourAsync(request, response, next) {
  const newTour = await Tour.create(request.body);

  response.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
}

export async function updateTourAsync(request, response, next) {
  const tour = await Tour.findByIdAndUpdate(request.params.id, request.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError(`No tour found with ID ${request.params.id}`, 404));
  }

  response.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
}

export async function deleteTourAsync(request, response, next) {
  const tour = await Tour.findByIdAndDelete(request.params.id);

  if (!tour) {
    return next(new AppError(`No tour found with ID ${request.params.id}`, 404));
  }

  response.status(204).json({
    status: 'success',
    data: null,
  });
}

export async function getTourStatsAsync(request, response, next) {
  const stats = await Tour.aggregate([
    {
      $match : { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },

      }
    },
    {
      $sort: { avgPrice: 1 }
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } }
    // }
  ]);

  response.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
}

export async function getMonthlyPlanAsync(request, response, next) {
  const year = +request.params.year;

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0,
        numTourStarts: 1,
        month: 1,
        tours: 1
      }
    },
    {
      $sort: { numTourStarts: -1 }
    },
    {
      $limit: 12
    }
  ]);

  response.status(200).json({
    status: 'success',
    resultCount: plan.length,
    data: {
      plan
    }
  });
}