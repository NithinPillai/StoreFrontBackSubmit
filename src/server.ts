import express, { Request, Response } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import userRoutes from './handlers/userHandler';
import productRoutes from './handlers/productsHandler';
import orderRoutes from './handlers/orderHandler';
import dotenv from 'dotenv'
dotenv.config()

const app: express.Application = express()
const address: string = "127.0.0.1:3000"

import path from 'path';

const corsOptions = {}



let port = 3000;

if (process.env.ENV === 'test') {
  port = 3001;
}

app.use(cors(corsOptions))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});



userRoutes(app);
productRoutes(app);
orderRoutes(app);

app.listen(port, () => {
  console.info(`Express is listening at ${port}`);
});

export default app;