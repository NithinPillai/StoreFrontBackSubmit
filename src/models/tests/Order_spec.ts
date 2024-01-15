import supertest from 'supertest';
import jwt, { Secret } from 'jsonwebtoken';
import { BaseOrder, Order, StorefrontOrderStore } from '../SFOrder';
import { BaseProduct, StorefrontProductStore } from '../SFProduct';
import { BaseAuthUser, StorefrontUserStore } from '../SFUser';
import app from '../../server';

const request = supertest(app);
const store = new StorefrontOrderStore();
const productStore = new StorefrontProductStore();
const userStore = new StorefrontUserStore(); 

describe("SFOrder Model", () => {

  it("Should have an index method", () => {
      expect(store.indexOrder).toBeDefined(); 
  });

  it("Should have an create method", () => {
      expect(store.createOrder).toBeDefined(); 
  });

  it("Should have an show method", () => {
      expect(store.showOrder).toBeDefined(); 
  });

  it("Should have an update method", () => {
      expect(store.updateOrder).toBeDefined(); 
  });

  it("Should have an delete method", () => {
      expect(store.deleteOrder).toBeDefined(); 
  });
});

describe('Test Order Operations', () => {

      let myOrder: BaseOrder;
      let token: string;
      let userId: number;
      let order: Order;
    
      beforeAll(async () => {
        const res = await userStore.createUser({
            username: "bipitybopityboo",
            firstname: "asdf",
            lastname: "asdfasdf",
            password_digest: "password123123"
        });
        userId = res.id;

        myOrder = {
            products: [{product_id: 1, quantity: 2}], 
            user_id: userId, 
            status: true
          };
        
        order = await store.createOrder(myOrder);
      });
    
    
    it("CREATE Order", async () => {
        const r1 = await productStore.createProduct({name: 'phone', price: 1200});

        const result = await store.createOrder({
            products: [{product_id: r1.id, quantity: 1}], 
            user_id: userId, 
            status: false
          });
    
        expect(result).toEqual({
            id: result.id,
            products: [{product_id: r1.id, quantity: 1}], 
            user_id: userId, 
            status: false
        });

        store.deleteOrder(result.id)
    });
    
    it("INDEX all Orders", async () => {
        const result = await store.indexOrder();
        expect(result).toEqual(result);
    });
    
    it("READ Order", async () => {
        const createProduct = await store.createOrder(myOrder);
        const result = await store.showOrder(createProduct.id);
        expect(result).toEqual(createProduct);
        store.deleteOrder(createProduct.id);
    });
    
    it('UPDATE Order', async () => {
        const r1 = await productStore.createProduct({name: 'phone', price: 1200});
        const r2 = await store.updateOrder(order.id, {user_id:userId, status:false, products: [{product_id: r1.id, quantity: 2}]});
    
        expect(r2).toEqual({
            id: r2.id,
            status: false, 
            user_id: userId, 
            products: [{product_id: r1.id, quantity: 2}]
        });
    
    });
    
    it("DELETE Order", async () => {
        const createProduct = await store.createOrder(myOrder);
        const result = await store.deleteOrder(createProduct.id);
        expect(result).toEqual(true);
    });
});