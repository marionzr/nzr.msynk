import AbstractTest from '../AbstractTest';
import * as chai from 'chai';
import Log from '../../src/services/Log';
import { exists } from 'fs';

const TAG_NAME = __filename.slice(__dirname.length + 1);
const TAG = new Log.TAG(TAG_NAME);
const DEBUG_MESSAGE = 'DEBUG_MESSAGE';
const INFO_MESSAGE = 'INFO_MESSAGE';
const WARN_MESSAGE = 'WARN_MESSAGE';
const ERROR_MESSAGE = 'ERROR_MESSAGE';
const assert = chai.assert;

class LogTest extends AbstractTest {

    private _formatExpectedMessage(expectMessages: Map<Log.Level,string>, level: Log.Level): string {
        if (expectMessages.has(level)) {
            return `{${TAG.name}} - ${expectMessages.get(level)}`
        } else {
            return undefined;
        }
    }
    private _itLog(log: Log, expectMessages: Map<Log.Level,string>, done: MochaDone): void {
        log.debug(TAG, DEBUG_MESSAGE, (err, level, message) => {
            if (err) {
                done(err);
                return;
            }

            assert.equal(message, this._formatExpectedMessage(expectMessages, Log.Level.debug));

            if (message) {
                assert.equal(level, Log.Level.debug);
            }
        });

        log.info(TAG, INFO_MESSAGE, (err, level, message) => {
            if (err) {
                done(err);
                return;
            }

            assert.equal(message, this._formatExpectedMessage(expectMessages, Log.Level.info));

            if (message) {
                assert.equal(level, Log.Level.info);
            }
        });

        log.warn(TAG, WARN_MESSAGE, (err, level, message) => {
            if (err) {
                done(err);
                return;
            }

            assert.equal(message, this._formatExpectedMessage(expectMessages, Log.Level.warn));

            if (message) {
                assert.equal(level, Log.Level.warn);
            }
        });

        log.error(TAG, ERROR_MESSAGE, (err, level, message) => {
            if (err) {
                done(err);
                return;
            }

            assert.equal(message, this._formatExpectedMessage(expectMessages, Log.Level.error));

            if (message) {
                assert.equal(level, Log.Level.error);
            }
        });
    }

    public run(): void {
        describe('Log', () => {
            it('debug', (done) => {
                let log = Log.getInstance();
                log.level = Log.Level.debug;
                let expectMessages = new Map<Log.Level,string>();
                expectMessages.set(Log.Level.debug, DEBUG_MESSAGE);
                expectMessages.set(Log.Level.info, INFO_MESSAGE);
                expectMessages.set(Log.Level.warn, WARN_MESSAGE);
                expectMessages.set(Log.Level.error, ERROR_MESSAGE);
                this._itLog(log, expectMessages, done);
                done();
            });

            it('info', (done) => {
                let log = Log.getInstance();
                log.level = Log.Level.info;
                let expectMessages = new Map<Log.Level,string>();
                expectMessages.set(Log.Level.info, INFO_MESSAGE);
                expectMessages.set(Log.Level.warn, WARN_MESSAGE);
                expectMessages.set(Log.Level.error, ERROR_MESSAGE);
                this._itLog(log, expectMessages, done);
                done();
            });

            it('warn', (done) => {
                let log = Log.getInstance();
                log.level = Log.Level.warn;
                let expectMessages = new Map<Log.Level,string>();
                expectMessages.set(Log.Level.warn, WARN_MESSAGE);
                expectMessages.set(Log.Level.error, ERROR_MESSAGE);
                this._itLog(log, expectMessages, done);
                done();
            });

            it('error', (done) => {
                let log = Log.getInstance();
                log.level = Log.Level.error;
                let expectMessages = new Map<Log.Level,string>();
                expectMessages.set(Log.Level.error, ERROR_MESSAGE);
                this._itLog(log, expectMessages, done);
                done();
            });

            it('purge', (done) => {
                Log.clearLogs()
                .then(() => {
                    Log.getLogCount()
                        .then((count) => {
                            done();
                        }, (err) => {
                            done(err);
                        })
                }, (err) => {
                    done(err);
                })
            });
        });
    }
}

export default new LogTest().run();
