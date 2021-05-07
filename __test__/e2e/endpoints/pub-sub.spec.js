import chai from 'chai';
import supertest from 'supertest';
import app from '../../../src/app';
import {after, before, beforeEach, describe} from 'mocha';
import {PUB_SUB_URL_PUBLISH, PUB_SUB_URL_SUBSCRIBE} from '../routes';
import nock from 'nock';

import {Subscribe} from '../../../src/api/pub-sub/pub-sub.model';
import {getPubSubObject} from '../../_seeds/pub-sub.seed';
import {HTTP_CONFLICT, HTTP_CREATED, HTTP_NOT_FOUND, HTTP_OK} from '../../../src/utils/status-codes';

let should = chai.should();
let expect = chai.expect;
let server;

let test1;
let test2;
let test3;

describe('Set For Login Test', () => {
    before(async () => {
        server = supertest(await app);
        await Subscribe.remove({});
        await (Subscribe.insertMany(getPubSubObject()));

        //TEST URLS
        test1 = await nock('http://test1')
            .post('/')
            .reply((uri, body) => {
                expect(body).to.deep.equal({
                    topic: 'topic1',
                    data: {
                        message: 'Hello!'
                    }
                });
                return [200, 'Well received'];
            });

        test2 = nock('http://test3')
            .post('/')
            .reply((uri, body) => {
                expect(body).to.deep.equal({
                    topic: 'topic1',
                    data: {
                        message: 'Hello!'
                    }
                });
                return [200, 'Well received'];
            });

        test3 = nock('http://test3')
            .post('/')
            .reply((uri, body) => {
                expect(body).to.deep.equal({
                    topic: 'topic2',
                    data: {
                        message: 'Hello!'
                    }
                });
                return [200, 'Well received'];
            });
    });

    after(async () => {
        await Subscribe.remove({});
    });

    describe('PubSub POST Endpoint Test /subscribe/{topic} ' + PUB_SUB_URL_SUBSCRIBE, () => {
        it('Should successfully subscribe to a new topic ', async () => {
            const topic = 'topic1';
            const response = await server.post(`${PUB_SUB_URL_SUBSCRIBE}/${topic}`)
                .send({data: {url: 'http://test1'}})
                .expect('Content-type', 'application/json; charset=utf-8')
                .expect(HTTP_CREATED);

            response.body.should.be.instanceOf(Object);
            response.body.should.have.property('_meta');
            response.body._meta.should.have.property('status_code');
            response.body._meta.should.have.property('message');
            response.body.should.have.property('data');
            response.body.data.should.be.instanceOf(Object);

        });
        it('Should test fail to subscribe to the same topic with the same url twice ', async () => {
            const topic = 'topic1';
            const response = await server.post(`${PUB_SUB_URL_SUBSCRIBE}/${topic}`)
                .send({data: {url: 'http://test1'}})
                .expect('Content-type', 'application/json; charset=utf-8')
                .expect(HTTP_CONFLICT);

            response.body.should.be.instanceOf(Object);
            response.body.should.have.property('_meta');
            response.body._meta.should.have.property('status_code');
            response.body._meta.should.have.property('error');
            response.body._meta.error.should.have.property('code');
            response.body._meta.error.should.have.property('message');
        });
    });
    describe('PubSub POST Endpoint Test /publish/{topic}', () => {
        it('Should test successfully send to valid urls', async () => {
            const response = await server.post(`${PUB_SUB_URL_PUBLISH}/topic1`)
                .send({data: {message: 'Hello'}})

            expect(test1.isDone()).to.be.equal(false);
            expect(test2.isDone()).to.be.equal(false);
        });

        it('Should test fail to publish if topic does not exist ', async () => {
            const topic = 'topic4';
            const response = await server.post(`${PUB_SUB_URL_PUBLISH}/${topic}`)
                .send({data: {message: 'http://test4'}})
                .expect('Content-type', 'application/json; charset=utf-8')
                .expect(HTTP_NOT_FOUND);

            response.body.should.be.instanceOf(Object);
            response.body.should.have.property('_meta');
            response.body._meta.should.have.property('status_code');
            response.body._meta.should.have.property('error');
            response.body._meta.error.should.have.property('code');
            response.body._meta.error.should.have.property('message');
        });
    });

});

