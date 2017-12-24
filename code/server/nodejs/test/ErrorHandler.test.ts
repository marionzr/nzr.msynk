import AbstractTest from './AbstractTest';
import * as errorHandler from 'errorhandler';
import * as http from 'http';
import * as express from 'express';
import * as chai from 'chai';
import App from '../src/App';
import OopsRoute  from '../src/config/routes/testRoutes/errorRoutes/OopsRoute';
import UnknownErrorRoute  from '../src/config/routes/testRoutes/errorRoutes/UnknownErrorRoute';
chai.use(require('chai-http')); //import chaiHttp from 'chai-http' then chai.use(chaiHttp) did not worked
const assert = chai.assert;

class ConfigTest extends AbstractTest {
    public run(): void {
        describe('Error Handler', function () {
            it('Oops error', function (done) {
                let oops = new OopsRoute();
                chai.request(new App().server)
                    .get(oops.path)
                    .end((err: any, res: ChaiHttp.Response) => {
                        assert.equal(res.status, 500);
                        assert.equal(res.type, 'text/html');
                        assert.isTrue(res.text.trim().indexOf('Error: oops!') !== -1);
                        done();
                    });
            });

            it('Internal Server Error', function (done) {
                let unknownErrorRoute = new UnknownErrorRoute();
                chai.request(new App().server)
                    .get(unknownErrorRoute.path)
                    .end((err: any, res: ChaiHttp.Response) => {
                        assert.equal(res.status, 500);
                        assert.equal(res.type, 'text/plain');
                        assert.equal(res.text.trim(), 'Internal Server Error');
                        done();
                });
            });
        });
    }
}

export default new ConfigTest().run();
