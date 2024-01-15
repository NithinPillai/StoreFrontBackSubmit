"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const server_1 = __importDefault(require("../../../src/server"));
const request = (0, supertest_1.default)(server_1.default);
const SECRET = process.env.TOKEN_KEY;
describe('Product Handler', () => {
    const product = {
        name: 'Basil Barramunda',
        price: 29,
    };
    let token, userId;
    beforeAll(async () => {
        const userData = {
            username: 'ChrisAnne',
            firstname: 'Chris',
            lastname: 'Anne',
            password: 'password123',
        };
        const { body } = await request.post('/users/create').send(userData);
        token = body;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { user } = jsonwebtoken_1.default.verify(body, SECRET);
        userId = user.id;
    });
    afterAll(async () => {
        await request.delete(`/users/${userId}`).set('Authorization', 'bearer ' + token);
    });
    it('gets the create endpoint', async (done) => {
        const res = await request
            .post('/products/create')
            .send(product)
            .set('Authorization', 'bearer ' + token);
        expect(res.status).toBe(200);
        done();
    });
    it('gets the index endpoint', async (done) => {
        const res = await request.get('/products');
        expect(res.status).toBe(200);
        done();
    });
    it('gets the read endpoint', async (done) => {
        const res = await request.get(`/products/2`);
        expect(res.status).toBe(200);
        done();
    });
    it('gets the update endpoint', async (done) => {
        const newProductData = {
            ...product,
            name: 'Shoes',
            price: 234,
        };
        const res = await request
            .put(`/products/1`)
            .send(newProductData)
            .set('Authorization', 'bearer ' + token);
        expect(res.status).toBe(200);
        done();
    });
    it('gets the delete endpoint', async (done) => {
        const res = await request.delete(`/products/2`).set('Authorization', 'bearer ' + token);
        expect(res.status).toBe(200);
        done();
    });
});
