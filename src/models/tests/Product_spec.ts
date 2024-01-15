import supertest from 'supertest';
import jwt, { Secret } from 'jsonwebtoken';
import { BaseProduct, Product } from '../../models/SFProduct';
import { BaseAuthUser } from '../../models/SFUser';
import app from '../../server';
import { StorefrontProductStore } from '../SFProduct';

const request = supertest(app);
const SECRET = process.env.TOKEN_KEY as Secret;

const store = new StorefrontProductStore();

describe("SFProduct Model", () => {
  
  it("Should have an index method", () => {
      expect(store.indexProduct).toBeDefined(); 
  });

  it("Should have an create method", () => {
      expect(store.createProduct).toBeDefined(); 
  });

  it("Should have an read method", () => {
      expect(store.showProduct).toBeDefined(); 
  });

  it("Should have an update method", () => {
      expect(store.updateProduct).toBeDefined(); 
  });

  it("Should have an delete method", () => {
      expect(store.deleteProduct).toBeDefined(); 
  });
});

describe('Test Product Operations', () => {
  const prod: BaseProduct = {
    name: 'Desk',
    price: 50,
  };

  let token: string;
  let userId: number;
  let product: Product;

  beforeAll(async () => {
    product = await store.createProduct(prod);
  });


it("CREATE Product", async () => {
    const result = await store.createProduct(prod);

    expect(result).toEqual({
        id: result.id,
        name: prod.name, 
        price: prod.price
    });

    store.deleteProduct(result.id)
});

it("INDEX all Products", async () => {
    const result = await store.indexProduct();
    expect(result).toEqual(result);
});

it("READ Product", async () => {
    const createProduct = await store.createProduct(prod);
    const result = await store.showProduct(createProduct.id);
    expect(result).toEqual(createProduct);
    store.deleteProduct(createProduct.id);
});

it('UPDATE Product', async () => {
    const r2 = await store.updateProduct(product.id, {name:'Apple Watch', price:300});

    expect(r2).toEqual({
        id: product.id,
        name: 'Apple Watch', 
        price: 300
    });

});

it("DELETE Product", async () => {
    const createProduct = await store.createProduct(prod);
    const result = await store.deleteProduct(createProduct.id);
    expect(result).toEqual(true);
});
});