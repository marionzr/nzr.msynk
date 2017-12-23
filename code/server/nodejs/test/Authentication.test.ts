import AbstractMochaTest from './AbstractMochaTest';
import * as chai from 'chai';
import Authentication from '../src/services/authentication/Authentication';
import LocalAuthentication from '../src/services/authentication/LocalAuthenticationStrategy'
import { TokenExpiredError } from 'jsonwebtoken';
import Log from '../src/services/Log';
const assert = chai.assert;

class AuthenticationTest extends AbstractMochaTest {

    constructor() {
        super();
    }

    protected createLogTAG(): Log.TAG {
        return new Log.TAG(__filename);
    }

    public run(): void {
        describe('Authentication', function () {
            it('local_login_is_valid', function (done) {
                const localAuth = new LocalAuthentication();
                const auth = new Authentication('secret', 5, localAuth);
                const user = 'msynk';
                const password = '12345';
                auth.login(user, password, localAuth.name)
                    .then((token) => {
                        assert.exists(token, 'Missing token');
                        auth.isAuthorized(token)
                            .then((decoded) => {
                                assert.equal(decoded, user, 'Invalid decoded used');
                                done();
                            }, (err: Error) => {
                                done(err);
                            })
                            .catch((err) => {
                                done(err);
                            })
                    }, (err: Error) => {
                        done(err);
                    })
                    .catch((err: Error) => {
                        done(err);
                    });
            });

            it('local_login_is_valid_but_token_expired', function (done) {
                const localAuth = new LocalAuthentication();
                const timeoutSec = 1;
                const auth = new Authentication('secret', timeoutSec, localAuth);
                const user = 'msynk';
                const password = '12345';
                auth.login(user, password, localAuth.name)
                    .then((token) => {
                        assert.exists(token, 'Missing token');
                        setTimeout(() => {
                            auth.isAuthorized(token)
                                .then((decoded) => {
                                    assert.fail();
                                    done();
                                }, (err: Error) => {
                                    assert.isTrue(err instanceof TokenExpiredError);
                                    done();
                                })
                                .catch((err) => {
                                    done(err);
                                });
                            }, (timeoutSec + 1) * 1000);
                    }, (err: Error) => {
                        done(err);
                    })
                    .catch((err: Error) => {
                        done(err);
                    });
            });

            it('local_login_is_invalid', function (done) {
                const localAuth = new LocalAuthentication();
                const auth = new Authentication('secret', 5, localAuth);
                auth.login('wrong', '00000', localAuth.name)
                    .then((token) => {
                        assert.fail();
                        done();
                    }, (err: Error) => {
                        assert.exists(err);
                        done();
                    });
            });
        });
    }
}

export default new AuthenticationTest().run();
