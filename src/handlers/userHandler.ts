import { Application, Request, Response, NextFunction} from 'express';
import { User, StorefrontUserStore } from '../models/SFUser';
import jwt, { Secret } from 'jsonwebtoken'
import dotenv from 'dotenv'

const userStore = new StorefrontUserStore();
dotenv.config()

const indexUser = async (req: Request, res: Response) => {
    const users: User[] = await userStore.indexUser();
    res.json(users);
};

const createUser = async (req: Request, res: Response) => {
  const newUser: User = await userStore.createUser({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    password_digest: req.body.password,
  });

  res.json(jwt.sign({ newUser }, process.env.TOKEN_KEY as Secret));
};

const authenticate = async (req: Request, res: Response) => {
  try { 
    const u = await userStore.authenticate(req.body.username, req.body.password) 
    var token = jwt.sign({ user: u }, process.env.TOKEN_SECRET as Secret); 
    res.status(200) 
    res.json(token) 
  } catch(error) { 
    res.status(401) 
  } 
};

const readUser = async (req: Request, res: Response) => {

    const id = req.params.id as unknown as number;

    const user: User = await userStore.showUser(id);
    res.json(user);

};

const updateUser = async (req: Request, res: Response) => {
    const id = req.params.id as unknown as number;
    const firstname = req.body.firstname as unknown as string;
    const lastname = req.body.lastname as unknown as string;

    const user: User = await userStore.updateUser(id, 
      firstname,
      lastname,
    );
    res.json(user);
};

const deleteUser = async (req: Request, res: Response) => {
    const id = req.params.id as unknown as number;
    await userStore.deleteUser(id);
    res.send(`User with id ${id} successfully deleted.`);
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

export default function userRoutes(app: Application) {
  app.get('/users', indexUser);
  app.post('/users/create', createUser);
  app.get('/users/:id', readUser);
  app.post('/users/authenticate', authenticate);
  app.put('/users/:id', checkToken, updateUser);
  app.delete('/users/:id', checkToken, deleteUser);
}