import * as fs from 'fs';
import AuthenticationStrategy from './AuthenticationStrategy';
import AuthenticationError from './AuthenticationError';
import Security from '../security/Security';
import Log from '../Log';
import Util from '../Util';
import R from '../../resources/R';
import SQLiteDatabase from '../database/sqlite/SQLiteDatabase';
import AbstractConnection from '../database/AbstractConnection';
import QueryResult from '../database/QueryResult';
import SQLiteDaoHelper from '../database/sqlite/SQLiteDaoHelper';


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
    private _db: SQLiteDatabase;
    public static ADMIN = 'madmin';
    public static TEST = 'test';
    private static USER_DB = 'user.db';
    private static initialized = false;

    constructor() {
        this._log = Log.getInstance();
        this._strategyName = LocalAuthenticationStrategy.name;
        const onLoad = (err: Error) => {
            console.log(err);
        };

        this._db = SQLiteDatabase.instance;
        this._db.createConnection()
        .then((connection: AbstractConnection) => {
            const helper = new SQLiteDaoHelper(connection);
            helper.executeNonQuery(R.strings.SQLITE_MSY_LOCAL_USRER_CREATE)
            .then((result: QueryResult) => {
                this._init();
            }, (err: Error) => {
                this._log.error(TAG, err);
            });
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

            this._db.createConnection()
            .then((connection: AbstractConnection) => {
                const helper = new SQLiteDaoHelper(connection);
                helper.addParameter(username);
                helper.executeQuery(R.strings.SQLITE_MSY_LOCAL_USER_SELECT_BY_USERNAME)
                .then((result: QueryResult) => {
                    if (result.rows.length === 0) {
                        reject(new Error('Invalid user name or password'));
                    } else {
                        const decryptedPass = Security.decrypt(result.rows[0].password);

                        if (decryptedPass === password) { 
                            resolve();
                        } else {
                            reject();
                        }
                    }
                }, (err: Error) => {
                    reject(err);
                });
            });
        });

        return promise;
    }

    get strategyName(): string {
        return this._strategyName;
    }

    private _init(): void {
        this._createUsers(LocalAuthenticationStrategy.ADMIN, process.env.MADMIN_PASSWORD);
        if (Util.isTestEnv) {
            this._createUsers(LocalAuthenticationStrategy.TEST, process.env.TEST_PASSWORD);
        } else {
            this._db.createConnection()
            .then((connection: AbstractConnection) => {
                const helper = new SQLiteDaoHelper(connection);
                helper.addParameter(LocalAuthenticationStrategy.TEST);
                helper.executeNonQuery(R.strings.SQLITE_MSY_LOCAL_USER_DELETE)
                .then((result: QueryResult) => {
                    this._log.info(TAG, `${LocalAuthenticationStrategy.TEST} user deleted: ${result.rowsAffected}.`);
                }, (err) => {
                    this._log.error(TAG, err);
                });
            });
        }
    }

    private _createUsers(user: string, password: string) {
        this._db.createConnection()
        .then((connection: AbstractConnection) => {            
            const helper = new SQLiteDaoHelper(connection);
            helper.addParameter(user);
            helper.executeQuery(R.strings.SQLITE_MSY_LOCAL_USER_SELECT_BY_USERNAME)
            .then((result: QueryResult) => {
                helper.clearParameters();
                let sql: string;
                let operation: string;                
                if (result.rows.length === 1) {
                    operation = 'updated';
                    helper.addParameter(password);                
                    helper.addParameter(user);
                    sql = R.strings.SQLITE_MSY_LOCAL_USER_UPDATE_PASSWORD_BY_USERNAME;
                } else {
                    operation = 'inserted';
                    helper.addParameter(user);
                    helper.addParameter(password);                
                    sql = R.strings.SQLITE_MSY_LOCAL_USER_INSERT;
                }
                
                helper.executeNonQuery(sql)
                .then((result: QueryResult) => {
                    this._log.info(TAG, `${user} user ${operation}: ${result.rowsAffected}.`);
                }, (err) => {
                    this._log.error(TAG, err);
                });
            }, (err) => {
                this._log.error(TAG, err);
            });
        }, (err) => {
            this._log.error(TAG, err);
        });
    }
}

export default LocalAuthenticationStrategy;
