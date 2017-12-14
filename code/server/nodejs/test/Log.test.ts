process.env.NODE_ENV = 'test';
import * as chai from 'chai';
import Log from '../src/services/Log';
import { exists } from 'fs';

const TAG_NAME = __filename.slice(__dirname.length + 1);
const DEBUG_MESSAGE = 'DEBUG_MESSAGE';
const INFO_MESSAGE = 'INFO_MESSAGE';
const WARN_MESSAGE = 'WARN_MESSAGE';
const ERROR_MESSAGE = 'ERROR_MESSAGE';
const assert = chai.assert;

describe('Log', () => {
    it('debug', (done) => {
        let log = new Log(Log.Level.debug);
        let TAG = new Log.TAG(TAG_NAME);

        log.debug(TAG, DEBUG_MESSAGE, (err, level, message) => {
            assert.equal(message, `{${TAG.name}} - ${DEBUG_MESSAGE}`);
            assert.equal(level, Log.Level.debug);
        });

        log.info(TAG, INFO_MESSAGE, (err, level, message) => {
            assert.equal(message, `{${TAG.name}} - ${INFO_MESSAGE}`);
            assert.equal(level, Log.Level.info);
        });

        log.warn(TAG, WARN_MESSAGE, (err, level, message) => {
            assert.equal(message, `{${TAG.name}} - ${WARN_MESSAGE}`);
            assert.equal(level, Log.Level.warn);
        });

        log.error(TAG, ERROR_MESSAGE, (err, level, message) => {
            assert.equal(message, `{${TAG.name}} - ${ERROR_MESSAGE}`);
            assert.equal(level, Log.Level.error);
        });

        done();
    });

    it('info', (done) => {
        let log = new Log(Log.Level.info);
        let TAG = new Log.TAG(TAG_NAME);

        log.debug(TAG, DEBUG_MESSAGE, (err, level, message) => {
            assert.equal(message, undefined);
            assert.equal(level, undefined);
        });

        log.info(TAG, INFO_MESSAGE, (err, level, message) => {
            assert.equal(message, `{${TAG.name}} - ${INFO_MESSAGE}`);
            assert.equal(level, Log.Level.info);
        });

        log.warn(TAG, WARN_MESSAGE, (err, level, message) => {
            assert.equal(message, `{${TAG.name}} - ${WARN_MESSAGE}`);
            assert.equal(level, Log.Level.warn);
        });

        log.error(TAG, ERROR_MESSAGE, (err, level, message) => {
            assert.equal(message, `{${TAG.name}} - ${ERROR_MESSAGE}`);
            assert.equal(level, Log.Level.error);
        });

        done();
    });

    it('warn', (done) => {
        let log = new Log(Log.Level.warn);
        let TAG = new Log.TAG(TAG_NAME);

        log.debug(TAG, DEBUG_MESSAGE, (err, level, message) => {
            assert.equal(message, undefined);
            assert.equal(level, undefined);
        });

        log.info(TAG, INFO_MESSAGE, (err, level, message) => {
            assert.equal(message, undefined);
            assert.equal(level, undefined);
        });

        log.warn(TAG, WARN_MESSAGE, (err, level, message) => {
            assert.equal(message, `{${TAG.name}} - ${WARN_MESSAGE}`);
            assert.equal(level, Log.Level.warn);
        });

        log.error(TAG, ERROR_MESSAGE, (err, level, message) => {
            assert.equal(message, `{${TAG.name}} - ${ERROR_MESSAGE}`);
            assert.equal(level, Log.Level.error);
        });

        done();
    });

    it('error', (done) => {
        let log = new Log(Log.Level.error);
        let TAG = new Log.TAG(TAG_NAME);

        log.debug(TAG, DEBUG_MESSAGE, (err, level, message) => {
            assert.equal(message, undefined);
            assert.equal(level, undefined);
        });

        log.info(TAG, INFO_MESSAGE, (err, level, message) => {
            assert.equal(message, undefined);
            assert.equal(level, undefined);
        });

        log.warn(TAG, WARN_MESSAGE, (err, level, message) => {
            assert.equal(message, undefined);
            assert.equal(level, undefined);
        });

        log.error(TAG, ERROR_MESSAGE, (err, level, message) => {
            assert.equal(message, `{${TAG.name}} - ${ERROR_MESSAGE}`);
            assert.equal(level, Log.Level.error);
        });

        done();
    });

    it('purge', (done) => {
        Log.clearLogs().then(() => {
            Log.hasLogs().then((hasLogs) => {
                assert.isFalse(hasLogs);
            })
            .catch((err: Error) => {
                assert.isNotOk(false, err.message);
            })
            .then(() => {
                done();
            });
        });

    });
});
