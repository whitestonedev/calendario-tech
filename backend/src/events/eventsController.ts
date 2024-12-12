import { Request, Response } from 'express';
import {
  eventsJSONPath,
  getJSONEventsListGroupedByDate,
} from '../utils/events.js';

export const getEventsList = (req: Request, res: Response): void => {
  // read events from events.json
  res.sendFile(eventsJSONPath);
};

export const getEventsListGroupedByDate = (
  req: Request,
  res: Response,
): void => {
  const data = getJSONEventsListGroupedByDate();
  res.json(data);
};
