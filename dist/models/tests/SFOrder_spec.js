"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/ban-ts-comment */
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../../../src/server"));
const request = (0, supertest_1.default)(server_1.default);
describe('Order Handler', () => {
    let token;
    beforeAll(async () => {
        const userData = {
            username: 'ChrisAnne',
            firstname: 'Chris',
            lastname: 'Anne',
            password: 'password123',
        };
        const productData = {
            name: 'Shoes',
            price: 234,
        };
        const { body: userBody } = await request.post('/users/create').send(userData);
        token = userBody;
    });
    it('should create order endpoint', async (done) => {
        const res = await request
            .post('/orders/create')
            .set('Authorization', 'Bearer ' + token)
            .send({
            id: 1,
            products: [
                {
                    product_id: 5,
                    quantity: 5,
                },
            ],
            user_id: 3,
            status: true,
        });
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            id: 1,
            products: [
                {
                    product_id: 5,
                    quantity: 5,
                },
            ],
            user_id: 3,
            status: true,
        });
        done();
    });
    it('gets the index endpoint', async (done) => {
        request
            .get('/orders')
            .set('Authorization', 'bearer ' + token)
            .then((res) => {
            expect(res.status).toBe(200);
            done();
        });
    });
    it('should gets the read endpoint', async (done) => {
        request
            .get(`/orders/1`)
            .set('Authorization', 'bearer ' + token)
            .then((res) => {
            expect(res.status).toBe(200);
            done();
        });
    });
    it('should gets the delete endpoint', async (done) => {
        request
            .delete(`/orders/2`)
            .set('Authorization', 'bearer ' + token)
            .then((res) => {
            expect(res.status).toBe(200);
            done();
        });
    });
});
