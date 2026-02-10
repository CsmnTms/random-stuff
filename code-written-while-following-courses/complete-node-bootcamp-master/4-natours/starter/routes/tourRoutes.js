import { Router } from 'express';
import * as tourController from '../controllers/tourController.js';
import { catchAsync } from '../utils/catchAsync.js';

const router = Router();

router.route('/top-5-cheap') // route aliasing
  .get(tourController.aliasTopTours, catchAsync(tourController.getAllToursAsync));

router.route('/stats') 
  .get(catchAsync(tourController.getTourStatsAsync));

  router.route('/monthly-plan/:year')
  .get(catchAsync(tourController.getMonthlyPlanAsync));

router.route('/') // routes are also underlying middlewares, i think
  .get(catchAsync(tourController.getAllToursAsync))
  .post(catchAsync(tourController.createTourAsync));
  
router.route('/:id')
  .get(catchAsync(tourController.getTourAsync))
  .patch(catchAsync(tourController.updateTourAsync))
  .delete(catchAsync(tourController.deleteTourAsync));

export default router;