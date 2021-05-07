import {User} from '../../../src/api/user/user.model';

import chai from 'chai';
import supertest from 'supertest';
import app from '../../../src/app';
import {after, before, describe} from 'mocha';
import {AUTH_URL} from '../routes';

let should = chai.should();
let server;

describe('Set For Login Test', () => {
    before(async () => {
        server = supertest(await app);
    });

    after(async () => {
        await User.remove({});
    });

    describe('Auth Endpoint Test ' + AUTH_URL, () => {
        it('Should test login a user that does not exist or not registered ', async () => {

        });

        it('Should login an existing user with valid details', async () => {

        });
    });


});

