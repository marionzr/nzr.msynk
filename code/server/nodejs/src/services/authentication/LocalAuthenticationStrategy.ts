import * as fs from 'fs';
import AuthenticationStrategy from './AuthenticationStrategy';
import AuthenticationError from './AuthenticationError';
import Security from '../security/Security';
import Log from '../Log';
import Util from '../Util';
import R from '../../resources/R';
import AbstractConnection from '../database/AbstractConnection';
import QueryResult from '../database/QueryResult';
import AbstractDao from '../database/AbstractDao';
import MsyLocalUserDao from '../../app/models/daos/MsyLocalUserDao';
import DaoFactory from '../database/DaoFactory';
import MsyLocalUser from '../../app/models/entities/MsyLocalUser';


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
    public static ADMIN = 'madmin';
    public static TEST = 'test';
    private static USER_DB = 'user.db';
    private static initialized = false;
    private _dao: MsyLocalUserDao;    

    constructor() {
        this._log = Log.getInstance();
        this._strategyName = LocalAuthenticationStrategy.name;
        const onLoad = (err: Error) => {
            console.log(err);
        };

        this._dao = DaoFactory.get<MsyLocalUserDao>(MsyLocalUserDao);   

        this._dao.create()        
        .then(() => {
            this._init();
        }, (err: Error) => {
            this._log.error(TAG, err);
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

            this._dao.select(username)            
            .then((msyLocalUser: MsyLocalUser) => {
                if (!msyLocalUser) {
                    reject(new Error('Invalid user name or password'));
                } else {
                    const decryptedPass = Security.decrypt(msyLocalUser.password);

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
            const msyLocalUser = new MsyLocalUser(LocalAuthenticationStrategy.TEST);
            this._dao.delete(msyLocalUser)
            .then((result: number) => {
                this._log.info(TAG, `${LocalAuthenticationStrategy.TEST} user deleted: ${result}.`);
            }, (err) => {
                this._log.error(TAG, err);
            });
        }
    }

    private _createUsers(username: string, password: string) {
        this._dao.select(username)
        .then((msyLocalUser: MsyLocalUser) => {            
            if (msyLocalUser) {
                msyLocalUser.password = password;
                this._dao.update(msyLocalUser)
                .then((rowsAffected: number) => {
                    this._log.info(TAG, `${username} user updated: ${rowsAffected}.`);
                }, (err) => { this._log.error(TAG, err); });
            } else {
                msyLocalUser = new MsyLocalUser(username, password);
                this._dao.insert(msyLocalUser)
                .then((msyLocalUser: MsyLocalUser) => {
                    this._log.info(TAG, `${username} user inserted. Id: ${msyLocalUser.id}.`);
                }, (err) => { this._log.error(TAG, err); });
            }           
        }, (err) => { this._log.error(TAG, err); });
    }
}

export default LocalAuthenticationStrategy;
