import * as Nedb from 'nedb';
import * as fs from 'fs';
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
    private readonly _db:Nedb;
    public static ADMIN = 'madmin';

    constructor() {
        this._log = Log.getInstance();
        this._strategyName = LocalAuthenticationStrategy.name;
        this._db = new Nedb({ filename: 'user.db', autoload: true });
        this._db.persistence.compactDatafile();
        this._db.persistence.setAutocompactionInterval(300000); // 5 minutes
        this._init();    
        setTimeout(() => {
            
        }, 3000);    
    }

    public isPasswordSet(): Promise<boolean> {
        const promise = new Promise<boolean>((resolve, reject) => {
            const fileName = process.env.PROPERTIES_FILE;
            const exists = fs.exists(fileName, (exists: boolean) => {
                if (!exists) {
                    resolve(false);
                } else {
                    const queryAdmin = { _username: LocalAuthenticationStrategy.ADMIN };
                    this._db.findOne(queryAdmin, (err, doc) => {
                        if (err) {
                            this._log.error(TAG, err);
                            reject(err);
                        } else if (!doc) {
                            resolve(false);
                        } else {
                            resolve(true);
                        }
                    });
                }
            });
        });
         
        return promise;
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
            
            this._db.findOne({ _username: username }, (err, doc: any) => {
                if (err) {
                    reject(err);
                } else if (!doc) {
                    reject();
                } else {
                    const decryptedPass = Security.decrypt(doc._password);
                    
                    if (decryptedPass === password) { 
                        resolve();
                    } else {
                        reject();
                    }
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

        if (!Util.isTestEnv()) {
            this._db.remove(queryTest, (err, n) => {
                this._db.persistence.compactDatafile();
           });
        } else {
            this._db.findOne(queryTest, (err, doc: any) => {
                if (doc) {
                    this._db.update(
                        { _id: doc._id }, 
                        { _username: queryTest._username, _password: process.env.TEST_PASSWORD }, 
                        { }, (err, n: number) => {
                            this._log.info(TAG, `User ${queryTest._username} updated`);                    
                        }
                    );
                } else {
                    this._db.insert({ _username: queryTest._username, _password: process.env.TEST_PASSWORD }, (err, doc) => {
                        this._log.info(TAG, `${doc} inserted`);
                    });
                }
            });
        };

        this._db.findOne(queryAdmin, (err, doc: any) => {
            if (doc) {
                this._db.update(
                    { _id: doc._id }, 
                    { _username: LocalAuthenticationStrategy.ADMIN, _password: process.env.MADMIN_PASSWORD }, 
                    { }, (err, n: number) => {
                        this._log.info(TAG, `User ${queryAdmin._username} updated`);                    
                    }
                );
            } else {
                this._db.insert({ _username: LocalAuthenticationStrategy.ADMIN, _password: process.env.MADMIN_PASSWORD }, (err, doc) => {
                    this._log.info(TAG, `${doc} inserted`);
                });
            }
        });        
    }

    private _find(query: any): Promise<any> {
        const promise = new Promise<any>((resolve, reject) => {
            this._db.findOne<any>(query, (err, doc: any) => {
                if (err) {
                    reject(err);
                } else if (!doc) {
                    const err = new AuthenticationError(`Invalid username (${query._username}) or password (${query.password})`);
                    this._log.info(TAG, err.message);
                    reject(err);
                } else {
                    resolve(doc);
                }
            });
        });
        
        return promise;
    }

    private _insert(user: any): void {
        this._db.insert<any>(user, (err, doc: any) => {
            this._log.info(TAG, `User ${user._username} inserted with id ${doc._id}`);
        });
    }

    private _remove(query: any): void {
        this._db.remove(query, { multi: true }, (err, n: number) => {
            this._log.info(TAG, `User ${query._username} deleted. Result: ${n}`);
        });
    }

    private _update(query: any, user: any) {
        this._db.update(query, user, { upsert: false, multi: false }, (err: Error, n: number) => {
            this._log.info(TAG, `User ${query._username} updated. Result: ${n}`);
        });
    }
}

export default LocalAuthenticationStrategy;
