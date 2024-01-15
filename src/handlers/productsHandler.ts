import { Application, Request, Response, NextFunction } from 'express';
import { Product, StorefrontProductStore } from '../models/SFProduct';
import jwt from 'jsonwebtoken'

const productStore = new StorefrontProductStore();

const getAllProduct = async (req: Request, res: Response) => {
    const products: Product[] = await productStore.indexProduct();
    res.json(products);
};

const createProduct = async (req: Request, res: Response) => {
    const product: Product = await productStore.createProduct({ name: req.body.name, price: req.body.price });
    res.json({product});
};

const readProduct = async (req: Request, res: Response) => {
  try {
    const product: Product = await productStore.showProduct(req.params.id as unknown as number);
    res.json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};

const updateProduct = async (req: Request, res: Response) => {
    const product: Product = await productStore.updateProduct(req.params.id as unknown as number, 
      {name : req.body.name, price : req.body.price}
      );

    res.json(product);
};

const deleteProduct = async (req: Request, res: Response) => {
    await productStore.deleteProduct(req.params.id as unknown as number);
    res.send(true);
};

const checkToken = (req: Request,res: Response,next: NextFunction) => {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      jwt.verify(token, process.env.TOKEN_SECRET as string);
      next();
    } else {
      return false; 
    }
};
  

export default function productRoutes(app: Application) {
  app.get('/products', getAllProduct);
  app.post('/products/create', checkToken, createProduct);
  app.get('/products/:id', readProduct);
  app.put('/products/:id', checkToken, updateProduct);
  app.delete('/products/:id', checkToken, deleteProduct);
}