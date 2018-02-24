import * as fs from 'fs';
import { Database, RunResult, Statement } from 'sqlite3';
import AuthenticationStrategy from './AuthenticationStrategy';
import AuthenticationError from './AuthenticationError';
import Security from '../security/Security';
import Log from '../Log';
import Util from '../Util';


const TAG: Log.TAG = new Log.TAG(__filename);

/**
 * Implements an Authentication Stategy using Local users.
 *
 * @class LocalAuthenticationStrategy
 * @implements {AuthenticationStrategy}
 */
class LocalAuthenticationStrategy implements AuthenticationStrategy {
    /**
     * Maps with users and passwords.
     *
     * @private
     * @type {Map<string, string>}
     * @memberof LocalAuthenticationStrategy
     */
    private readonly _log: Log;
    private readonly _strategyName: string;
    private _db: Database;
    public static ADMIN = 'madmin';
    private static USER_DB = 'user.db';
    private static initialized = false;

    constructor() {
        this._log = Log.getInstance();
        this._strategyName = LocalAuthenticationStrategy.name;
        const onLoad = (err: Error) => {
            console.log(err);
        }

        this._db = new Database('user.db', (err: Error) => {
            if (err) {
                this._log.error(TAG, err);
            } else {
                this._db.serialize(() => {
                    this._db.run(
                        `CREATE TABLE IF NOT EXISTS local_user (
                            username TEXT PRIMARY KEY,
                            password TEXT NOT NULL
                        )`, (result: RunResult, err: Error) => {
                            if (err) {
                                this._log.error(TAG, err);
                            } else {
                                this._init();
                            }
                        });
                });
            }
        });
    }

    public static encryptPassword(password: string): string {
        const encryptPassword = Security.encrypt(password);
        return encryptPassword;
    }

    /**
     * Authenticate the user with username and password.
     *
     * Returns a promise that resolves the authentication is valid and rejects otherwise.
     *
     * @param {string} username
     * @param {string} password
     * @returns {Promise<any>}
     * @memberof LocalAuthenticationStrategy
     */
    public authenticate(username: string, password: string): Promise<any> {
        this._log.debug(TAG, [this.authenticate.name, username, password]);

        const promise = new Promise<boolean>((resolve, reject) => {
            if (!username && !password) {
                const err = new AuthenticationError('Username and password not provided.');
                this._log.error(TAG, err);
                reject(err);
                return;
            }

            this._db.get(`SELECT username, password FROM local_user WHERE username = ?`, username, (err: Error, row: any) => {
                if (err) {
                    reject(err);
                } else if (row) {
                    const decryptedPass = Security.decrypt(row.password);

                    if (decryptedPass === password) { 
                        resolve();
                    } else {
                        reject();
                    }
                } else {
                    reject();
                }


            });
        });

        return promise;
    }

    get strategyName(): string {
        return this._strategyName;
    }

    private _init(): void {
        const queryAdmin = { _username: LocalAuthenticationStrategy.ADMIN };
        const queryTest = { _username: 'test' };        
        this._db.get(`SELECT username, password FROM local_user WHERE username = ?`, LocalAuthenticationStrategy.ADMIN, (err: Error, row: any) => {
            if (err) {
                this._log.error(TAG, err);
            } else if (row) {
                const stmt = this._db.prepare('UPDATE local_user SET password = ? WHERE username = ?;', process.env.MADMIN_PASSWORD, LocalAuthenticationStrategy.ADMIN);
                stmt.run((result: RunResult, err: Error) => {
                    if (err) {
                        this._log.error(TAG, err);
                    } else {
                        this._log.info(TAG, `${LocalAuthenticationStrategy.ADMIN} user updated: ${result}.`);
                    }
                }).finalize();
            } else {
                const stmt = this._db.prepare('INSERT INTO local_user VALUES (?, ?);', LocalAuthenticationStrategy.ADMIN, process.env.MADMIN_PASSWORD);
                stmt.run((result: RunResult, err: Error) => {
                    if (err) {
                        this._log.error(TAG, err);
                    } else {
                        this._log.info(TAG, `${LocalAuthenticationStrategy.ADMIN} user inserted: ${result}.`);
                    }
                }).finalize();
            }
        });

        if (!Util.isTestEnv()) {
            const stmt = this._db.prepare(`DELETE FROM local_user WHERE username = 'test';`);
            stmt.run((result: RunResult, err: Error) => {
                if (err) {
                    this._log.error(TAG, err);
                }
            }).finalize();
            return;
        } 

        this._db.get(`SELECT username, password FROM local_user WHERE username = ?`, 'test', (err: Error, row: any) => {
            if (err) {
                this._log.error(TAG, err);
            } else if (row) {
                const stmt = this._db.prepare('UPDATE local_user SET password = ? WHERE username = ?;', process.env.TEST_PASSWORD, 'test');
                stmt.run((result: RunResult, err: Error) => {
                    if (err) {
                        this._log.error(TAG, err);
                    } else {
                        this._log.info(TAG, `test user updated: ${result}.`);
                    }}).finalize();
            } else {
                const stmt = this._db.prepare('INSERT INTO local_user VALUES (\'test\', ?);', process.env.TEST_PASSWORD);
                stmt.run((result: RunResult, err: Error) => {
                    if (err) {
                        this._log.error(TAG, err);
                    } else {
                        this._log.info(TAG, `test user inserted: ${result}.`);
                    }}).finalize();
            }
        });
    }
}

export default LocalAuthenticationStrategy;
