import * as chai from 'chai';
import Log from '../src/services/Log';
import * as fs from 'fs';
const assert = chai.assert;

describe('Configuration', () => {
    beforeEach((done) => { //Run before each test
        done();
    });

    afterEach((done) => { //Run before each test
        done();
    });

    it ('has .env file', (done) => {
        assert.isTrue(fs.existsSync('./src/config/.env.properties'));
        done();
    });

    it('load', (done) => {
        assert.equal(process.env.DB_TYPE.trim().toLowerCase(), 'mysql');
        assert.equal(process.env.VERSION.trim(), '0.0.1');
        assert.hasAnyKeys(Log.Level, [process.env.LOG_LEVEL.trim()]);
        done();
    });

    it('unknown', (done) => {
        assert.notExists(process.env.SOME_INVALID_VAR);
        done();
    });
});
