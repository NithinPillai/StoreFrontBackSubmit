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
describe('User Handler', () => {
    const userData = {
        username: 'ChrisAnne',
        firstname: 'Chris',
        lastname: 'Anne',
        password: 'password123',
    };
    let token, userId = 1;
    it('should gets the create endpoint', async (done) => {
        const res = await request.post('/users/create').send(userData);
        const { body, status } = res;
        token = body;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { user } = jsonwebtoken_1.default.verify(token, SECRET);
        userId = user.id;
        expect(status).toBe(200);
        done();
    });
    it('should gets the index endpoint', async (done) => {
        const res = await request.get('/users').set('Authorization', 'bearer ' + token);
        expect(res.status).toBe(200);
        done();
    });
    it('should get the read endpoint', async (done) => {
        const res = await request.get(`/users/${userId}`).set('Authorization', 'bearer ' + token);
        expect(res.status).toBe(200);
        done();
    });
    it('should get the update endpoint', async (done) => {
        const newUserData = {
            ...userData,
            firstname: 'Chris',
            lastname: 'Anne',
        };
        const res = await request
            .put(`/users/${userId}`)
            .send(newUserData)
            .set('Authorization', 'bearer ' + token);
        expect(res.status).toBe(200);
        done();
    });
    it('should get the auth endpoint', async (done) => {
        const res = await request
            .post('/users/authenticate')
            .send({
            username: userData.username,
            password: userData.password,
        })
            .set('Authorization', 'bearer ' + token);
        expect(res.status).toBe(200);
        done();
    });
    it('should get the auth endpoint with wrong password', async (done) => {
        const res = await request
            .post('/users/authenticate')
            .send({
            username: userData.username,
            password: 'trtdtxcfcf',
        })
            .set('Authorization', 'bearer ' + token);
        expect(res.status).toBe(401);
        done();
    });
    it('should get the delete endpoint', async (done) => {
        const res = await request.delete(`/users/${userId}`).set('Authorization', 'bearer ' + token);
        expect(res.status).toBe(200);
        done();
    });
});
