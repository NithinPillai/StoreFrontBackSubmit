import { Application, Request, Response, NextFunction} from 'express';
import { BaseOrder, Order, OrderProduct, StorefrontOrderStore } from '../models/SFOrder';
import jwt, { Secret } from 'jsonwebtoken'

const store = new StorefrontOrderStore();

const indexOrder = async (req: Request, res: Response) => {
    const orders: Order[] = await store.indexOrder();
    res.json(orders);
};

const createOrder = async (req: Request, res: Response) => {
  try { 
    const authorizationHeader = req.headers.authorization as string
    const token = authorizationHeader.split(' ')[1] 
    jwt.verify(token, process.env.TOKEN_SECRET as Secret) 
  } catch(err) { 
    res.status(401) 
    res.json('Access denied, invalid token') 
    return 
  }

    const bOrder: BaseOrder = {
      products: req.body.products as OrderProduct[], 
      status: req.body.status as boolean, 
      user_id: req.body.user_id as number
    }

    const order: Order = await store.createOrder(bOrder);

    res.json(order);
};


const readOrder = async (req: Request, res: Response) => {
    const id = req.params.id as unknown as number;

    const order: Order = await store.showOrder(id);
    res.json(order);
};

const updateOrder = async (req: Request, res: Response) => {
    const id = req.params.id as unknown as number;
    const products = req.body.products as unknown as OrderProduct[];
    const status = req.body.status as unknown as boolean;
    const user_id = req.body.user_id as unknown as number;

    const order: Order = await store.updateOrder(id, {
      products,
      status,
      user_id,
    });

    res.json(order);
};

const deleteOrder = async (req: Request, res: Response) => {
    const id = req.params.id as unknown as number;

    await store.deleteOrder(id);
    res.send(`Order with id ${id} successfully deleted.`);
};

const checkToken = (req: Request,res: Response,next: NextFunction) => {
  if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.TOKEN_SECRET as string);
        console.log("token passesed")
        next();
      } else {
        console.log("req header was faslse")
        return false;

      }
  };
  

export default function orderRoutes(app: Application) {
  app.get('/orders', indexOrder);
  app.post('/orders/create', checkToken, createOrder);
  app.get('/orders/:id', checkToken, readOrder);
  app.put('/orders/:id', checkToken, updateOrder);
  app.delete('/orders/:id', checkToken, deleteOrder);
}