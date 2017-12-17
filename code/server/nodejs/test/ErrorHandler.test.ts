import * as errorHandler from 'errorhandler';
import * as http from 'http';
import * as express from 'express';
import * as chai from 'chai';
import App from '../src/App';
import OopsRoute  from '../src/config/routes/testRoutes/errorRoutes/OopsRoute';
import UnknownErrorRoute  from '../src/config/routes/testRoutes/errorRoutes/UnknownErrorRoute';
chai.use(require('chai-http')); //import chaiHttp from 'chai-http' then chai.use(chaiHttp) did not worked
const assert = chai.assert;

describe('Error Handler', function () {
    it('Oops error', function (done) {
        chai.request(new App().server)
            .get(OopsRoute.PATH)
            .end((err: any, res: ChaiHttp.Response) => {
                assert.equal(res.status, 500);
                assert.equal(res.type, 'text/html');
                assert.isTrue(res.text.trim().indexOf('Error: oops!') !== -1);
                done();
            });
    });

    it('Internal Server Error', function (done) {
        chai.request(new App().server)
            .get(UnknownErrorRoute.PATH)
            .end((err: any, res: ChaiHttp.Response) => {
                assert.equal(res.status, 500);
                assert.equal(res.type, 'text/plain');
                assert.equal(res.text.trim(), 'Internal Server Error');
                done();
          });
      });
});