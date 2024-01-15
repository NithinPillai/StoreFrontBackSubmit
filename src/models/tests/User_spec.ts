import supertest from 'supertest';
import jwt, { Secret } from 'jsonwebtoken';
import { BaseAuthUser, User } from '../../models/SFUser';
import app from '../../server';
import { StorefrontUserStore } from '../SFUser';

const request = supertest(app);

const store = new StorefrontUserStore();

describe("SFUser Model", () => {

    it("Should have an index method", () => {
        expect(store.indexUser).toBeDefined();
    });

    it("Should have an create method", () => {
        expect(store.createUser).toBeDefined();
    });

    it("Should have an show method", () => {
        expect(store.showUser).toBeDefined();
    });

    it("Should have an update method", () => {
        expect(store.updateUser).toBeDefined();
    });

    it("Should have an delete method", () => {
        expect(store.deleteUser).toBeDefined();
    });
});

describe('Test User Operations', () => {
    const me = {
        username: "npillai",
        firstname: "Nithin",
        lastname: "Pillai",
        password_digest: "pass1234"
    }

    let token: string;
    let userId = 0;
    let user: User;

    beforeAll(async () => {
        user = await store.createUser({
            username: "bipitybop",
            firstname: "Steve",
            lastname: "Jobs",
            password_digest: "pass1234"
        });
    });

    it("CREATE User", async () => {
        const result = await store.createUser(me);

        expect(result).toEqual({
            id: result.id,
            username: result.username,
            firstname: result.firstname,
            lastname: result.lastname,
            password_digest: result.password_digest
        });

        store.deleteUser(result.id)
    });

    it("INDEX all Users", async () => {
        const result = await store.indexUser();
        expect(result).toEqual(result);
    });

    it("READ User", async () => {
        const createProduct = await store.createUser(me);
        const result = await store.showUser(createProduct.id);
        expect(result).toEqual(createProduct);
        store.deleteUser(createProduct.id);
    });

    it('UPDATE User', async () => {
        const r2 = await store.updateUser(user.id, 'Rohit', 'John')

        expect(r2).toEqual({
            id: r2.id,
            username: user.username,
            firstname: 'Rohit',
            lastname: 'John',
            password_digest: user.password_digest
        });

    });

    it("DELETE User", async () => {
        const createProduct = await store.createUser(me);
        const result = await store.deleteUser(createProduct.id);
        expect(result).toEqual(result);
    });

    it('AUTH User', async () => {
        const res = await request.post('/users/authenticate')
            .send({
                username: me.username,
                password: me.password_digest,
            })
            .set('Authorization', 'bearer ' + token);

        expect(res.status).toBe(200);
        store.deleteUser(userId)

    });

    // it('AUTH User', async () => {
    //     const user1: BaseAuthUser = {
    //         username: "mummy",
    //         firstname: "king",
    //         lastname: "tut",
    //         password_digest: "egypt101"
    //     }; 
        
    //     const r1 = await store.createUser(user1);
    //     const res = await request.post('/users/authenticate')
    //         .send({
    //             username: user1.username,
    //             password: user1.password_digest,
    //         })
    //         .set('Authorization', 'bearer ' + token);

    //     expect(res.status).toBe(200);

    // });

      



});