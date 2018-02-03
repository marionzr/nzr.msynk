import AbstractTest from './AbstractTest';
import IndexRoute from '../src/config/routes/IndexRoute'
import * as chai from 'chai';
import App from '../src/App';
import AbstractRoute from '../src/config/routes/AbstractRoute';
import RouteLoader from '../src/config/routes/RouteLoader';
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
                        if (err) {
                            done(err);
                            return;
                        }

                        let routeLoader: RouteLoader = new RouteLoader();
                        let routes: Array<AbstractRoute> = routeLoader.load();
                        let routeDescription = RouteLoader.routesJSON(routes);

                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.have.property('routeDescription');
                        res.body.should.be.a('object');
                        res.body.routeDescription.should.equal(routeDescription);
                        done();
                    });
            });
        });
    }
}

export default new AppTest().run();
