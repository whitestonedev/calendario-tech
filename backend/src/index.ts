import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { eventsRoutes } from './events/eventsRoutes.js';

dotenv.config();

const app = express();
const port: number = parseInt(process.env.PORT || '3001', 10);

const generateRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello World!' });
});

app.get('/ping', (req: Request, res: Response) => {
  const random = generateRandomNumber(1, 100);
  res.json({ message: `pong ${random}` });
});

app.use('/events', eventsRoutes);

// Start the server
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

process.on('SIGINT', () => {
  console.log('Shutting down server...');

  const timeout = setTimeout(() => {
    console.error('Forcing shutdown due to timeout...');
    process.exit(1);
  }, 5000);

  server.close(() => {
    clearTimeout(timeout);
    console.log('Server closed.');
    process.exit(0);
  });
});
