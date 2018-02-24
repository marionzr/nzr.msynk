import AbstractTest from '../AbstractTest';
import * as chai from 'chai';
import * as dotenv from 'dotenv';
import Authentication from '../../src/services/authentication/Authentication';
import LocalAuthentication from '../../src/services/authentication/LocalAuthenticationStrategy'
import { TokenExpiredError } from 'jsonwebtoken';

const assert = chai.assert;
const username: string = 'test';
let password: string;
class AuthenticationTest extends AbstractTest {
    public run(): void {
       
        describe('Authentication', function () {
            dotenv.config({ path: './src/config/.env.properties' });
            password = 'test';
            const localAuth = new LocalAuthentication();
            beforeEach(() => {
                setTimeout(() => {
                    
                }, 1000);
            });

            it('local_login_is_valid', function (done) {
                const auth = new Authentication('secret', 5, localAuth);
                auth.authenticate(username, password, LocalAuthentication.name)
                    .then((token) => {
                        assert.exists(token, 'Missing token');
                        //assert.isTrue(//.test(token));
                        auth.isAuthorized(username, token)
                            .then((decoded) => {
                                assert.equal(decoded, username, 'Invalid decoded username.');
                                done();
                            }, (err: Error) => {
                                console.error(err);
                                done(err);
                            })
                            .catch((err) => {
                                console.error(err);
                                done(err);
                            })
                    }, (err: Error) => {
                        if (!err) {
                            err = new Error();
                        }

                        done(err);
                    })
                    .catch((err: Error) => {
                        console.error(err);
                        done(err);
                    });
            });

            it('local_login_is_valid_but_token_expired', function (done) {
                const timeoutSec = 1;
                const auth = new Authentication('secret', timeoutSec, localAuth);
                auth.authenticate(username, password, LocalAuthentication.name)
                    .then((token) => {
                        assert.exists(token, 'Missing token');
                        setTimeout(() => {
                            auth.isAuthorized(username, token)
                                .then((decoded) => {
                                    assert.fail();
                                    done();
                                }, (err: Error) => {
                                    assert.isTrue(err instanceof TokenExpiredError, `Expected ${err.name} to be TokenExpiredError\nError: ${err.stack}`);
                                    done();
                                })
                                .catch((err) => {
                                    done(err);
                                });
                            }, (timeoutSec + 1) * 1000);
                    }, (err: Error) => {
                        if (!err) {
                            err = new Error();
                        }

                        done(err);
                    })
                    .catch((err: Error) => {
                        done(err);
                    });
            });

            it('local_login_is_invalid', function (done) {
                const auth = new Authentication('secret', 5, localAuth);
                auth.authenticate(username + 'wrong', password + 'wrong', LocalAuthentication.name)
                    .then((token) => {
                        assert.fail();
                    }, (err: Error) => {                        
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });
        });
    }
}

export default new AuthenticationTest().run();
