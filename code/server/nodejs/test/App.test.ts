import AbstractTest from './AbstractTest';
import IndexRoute from '../src/config/routes/IndexRoute'
import * as chai from 'chai';
import App from '../src/App';
const should = chai.should();
chai.use(require('chai-http')); //import chaiHttp from 'chai-http' then chai.use(chaiHttp) did not worked

class AppTest extends AbstractTest {
    public run(): void {
        describe('App', () => {
            beforeEach((done) => { //Run before each test
                done();
            });

            afterEach((done) => { //Run before each test
                done();
            });

            it('server running', (done) => {
                let index = new IndexRoute();
                chai.request(new App().server)
                    .get(index.path)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.have.property('message');
                        res.body.should.be.a('object');
                        res.body.message.should.equal('It works!');
                        done();
                    });
            });
        });
    }
}

export default new AppTest().run();
