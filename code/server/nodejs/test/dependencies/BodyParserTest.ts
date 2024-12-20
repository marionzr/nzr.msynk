import AbstractTest from '../AbstractTest';
import * as errorHandler from 'errorhandler';
import * as http from 'http';
import * as express from 'express';
import * as chai from 'chai';
import App from '../../src/App';
import PingRoute  from '../../src/config/routes/testRoutes/PingRoute';
chai.use(require('chai-http')); //import chaiHttp from 'chai-http' then chai.use(chaiHttp) did not worked
const assert = chai.assert;

class BodyParserTest extends AbstractTest {
    public run(): void {
        describe('BodyParser', function () {
            let ping = new PingRoute();
            it('ping', function (done) {
                chai.request(new App().server)
                    .post(ping.path)
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
                chai.request(new App().server)
                    .post(ping.path)
                    .set('Content-Type', 'application/json')
                    .send('{"test":"wrong ping"}')
                    .end((err: any, res: ChaiHttp.Response) => {
                        assert.equal(res.status, 500);
                        assert.equal(res.type, 'text/html');
                        done();
                    });
            });
        });
    }
}

export default new BodyParserTest().run();