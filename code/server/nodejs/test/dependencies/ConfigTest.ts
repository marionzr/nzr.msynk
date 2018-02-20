import * as chai from 'chai';
import * as fs from 'fs';
import AbstractTest from '../AbstractTest';
import EnvProperties from '../../src/services/EnvProperties';
import Log from '../../src/services/Log';
const assert = chai.assert;

class ConfigTest extends AbstractTest {
    public run(): void {
        describe('Configuration', () => {
            const envProperties = process.env.PROPERTIES_FILE || './src/config/.env.properties';
            EnvProperties.load();

            beforeEach((done) => { //Run before each test
                done();
            });

            afterEach((done) => { //Run before each test
                done();
            });

            it('load', (done) => {
                assert.hasAnyKeys(Log.Level, [process.env.LOG_LEVEL.trim()]);
                done();
            });

            it('unknown', (done) => {
                assert.notExists(process.env.SOME_INVALID_VAR);
                done();
            });
        });
    }
}

export default new ConfigTest().run();
