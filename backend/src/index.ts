import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3001;

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello World!' });
});

app.get('/ping', (req: Request, res: Response) => {
  const random = Math.floor(Math.random() * 100) + 1;
  res.json({ message: 'pong ' + random });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
