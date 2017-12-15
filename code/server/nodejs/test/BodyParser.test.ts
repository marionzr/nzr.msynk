import * as errorHandler from 'errorhandler';
import * as http from 'http';
import * as express from 'express';
import * as chai from 'chai';
import app from '../src/App';
chai.use(require('chai-http')); //import chaiHttp from 'chai-http' then chai.use(chaiHttp) did not worked
const assert = chai.assert;

describe('BodyParser', function () {
    it('ping', function (done) {
        chai.request(app.server())
            .post('/ping')
            .set('Content-Type', 'application/json')
            .send('{"test":"ping"}')
            .end((err: any, res: ChaiHttp.Response) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.equal(res.body.trim(), '{"test":"pong"}');
                done();
            });
    });

    it('wrong ping', function (done) {
        chai.request(app.server())
            .post('/ping')
            .set('Content-Type', 'application/json')
            .send('{"test":"wrong ping"}')
            .end((err: any, res: ChaiHttp.Response) => {
                assert.equal(res.status, 500);
                assert.equal(res.type, 'text/html');
                done();
            });
    });
});