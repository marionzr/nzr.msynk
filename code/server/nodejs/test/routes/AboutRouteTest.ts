import AbstractTest from '../AbstractTest';
import AboutRoute from '../../src/config/routes/AboutRoute'
import * as chai from 'chai';
import App from '../../src/App';
const should = chai.should();
const chaiHttp = require('chai-http');
const assert = chai.assert;

chai.use(chaiHttp); //import chaiHttp from 'chai-http' then chai.use(chaiHttp) did not worked

class AboutRouteTest extends AbstractTest {
    public run(): void {
        let token: string = '';
        let about = new AboutRoute();
        describe(AboutRouteTest.name, () => {
            let server = new App().server;
            beforeEach((done) => { //Run before each test
                super.auth(server)
                    .then((tokenResult: string) => {
                        token = tokenResult;
                        done();
                    }, (err: Error) => {
                        done(err);
                    })
                    .catch((err: Error) => {
                        done(err);
                    });
            });

            afterEach((done) => { //Run before each test
                done();
            });

            it('GET ' + about.path, (done) => {
                chai.request(server)
                    .get(about.path)
                    .set('x-access-token', token)
                    .set('username', 'test')
                    .send({})
                    .then((res: ChaiHttp.Response) => {
                        assert.equal(res.status, 200);
                        done();
                    }, (err: Error) => {
                        done(err);
                    })
                    .catch((err: Error) => {
                        done(err);
                    });
            });
        });
    }
}

export default new AboutRouteTest().run();