process.env.NODE_ENV = 'test';
import * as chai from 'chai';
import app from '../src/App';
const should = chai.should();
chai.use(require('chai-http')); //import chaiHttp from 'chai-http' then chai.use(chaiHttp) did not worked

describe('App', () => {
    beforeEach((done) => { //Run before each test
        done();
    });

    afterEach((done) => { //Run before each test
        done();
    });

    it('server running', (done) => {
        chai.request(app.server())
            .get('/')
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
