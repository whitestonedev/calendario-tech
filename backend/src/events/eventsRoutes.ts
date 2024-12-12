import express from 'express';

import {
  getEventsList,
  getEventsListGroupedByDate,
} from './eventsController.js';

const router = express.Router();

router.get('/list', getEventsList);
router.get('/grouped', getEventsListGroupedByDate);

export { router as eventsRoutes };
