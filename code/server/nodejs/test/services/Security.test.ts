import AbstractTest from '../AbstractTest';
import * as chai from 'chai';
import Security from '../../src/services/security/Security';
const assert = chai.assert;

class SecurityTest extends AbstractTest {
    public run(): void {
        describe('Encrypt', () => {
            beforeEach((done) => { //Run before each test
                done();
            });

            afterEach((done) => { //Run before each test
                done();
            });

            it('encrypt numbers', (done) => {
                const value = '123456';
                const encrypt = Security.encrypt(value);
                const decrypt = Security.decrypt(encrypt);
                assert.equal(decrypt, value);
                done();
            });

            it('encrypt alfa', (done) => {
                const value = 'mario santos';
                const encrypt = Security.encrypt(value);
                const decrypt = Security.decrypt(encrypt);
                assert.equal(decrypt, value);
                done();
            });

            it('encrypt symbols', (done) => {
                const value = '* / @ # $ % ¨& * ( ) + - ';
                const encrypt = Security.encrypt(value);
                const decrypt = Security.decrypt(encrypt);
                assert.equal(decrypt, value);
                done();
            });
        });
    }
}

export default new SecurityTest().run();
