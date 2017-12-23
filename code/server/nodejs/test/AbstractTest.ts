import AuthenticationRoute from '../src/config/routes/AuthenticationRoute'
import * as chai from 'chai';
import * as express from 'express';
import EnvProperties from '../src/services/EnvProperties';
const should = chai.should();
const chaiHttp = require('chai-http');

abstract class AbstractTest {
    
    constructor() {
        EnvProperties.load();
    }

    public static error(error: Error): Error {
        return error || new Error('Test failed');
    }

    public abstract run(): void;

    protected auth(server: express.Application): Promise<string> {
        let auth = new AuthenticationRoute();
        let promise = new Promise<string>((resolve, reject) => {
            chai.request(server)
                .post(auth.path)
                .set("Content-Type", "application/json")
                .send('{"userx":{"name":"test", "password":"test"}}')
                .end((err, res: ChaiHttp.Response) => {
                    resolve(res.body.xAccessToken);
                });
        });

        return promise;
    }

}

export default AbstractTest;
