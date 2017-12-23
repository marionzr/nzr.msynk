import AuthenticationError from './AuthenticationError';
import AuthenticationStrategy from './AuthenticationStrategy';
import {JsonWebTokenError, NotBeforeError, TokenExpiredError} from 'jsonwebtoken';
import * as jwt from 'jsonwebtoken';
import { resolve } from 'path';
import LocalAuthenticationStrategy from './LocalAuthenticationStrategy';
import Log from '../Log';
const TAG: Log.TAG  = new Log.TAG(__filename);

/**
 * Service to authenticate a user and keeps its session.
 *
 * @class Authentication
 */
class Authentication {
    private readonly _strategies: Array<AuthenticationStrategy>;
    private readonly _secret: string;
    private readonly _expiresIn: number;
    private readonly _log: Log;

    constructor(secret: string, expiresIn: number, ...strategies: AuthenticationStrategy[]) {
        this._log = Log.getInstance();
        this._secret = secret;
        this._expiresIn = expiresIn;
        this._strategies = new Array<AuthenticationStrategy>();

        for(let strategy of strategies) {
            this._strategies.push(strategy);
        }
    }

    /**
     * Orchestrates the user authentication using the defined strategy.
     *
     * Returns promise with a token to future access authorization.
     *
     * If the authentication fail the promise will reject with AuthenticationError
     *
     * @param {string} userName
     * @param {string} password
     * @param {string} strategyName
     * @returns {Promise<string>}
     * @memberof Authentication
     */
    public authenticate(userName: string, password: string, strategyName: string): Promise<string> {
        this._log.debug(TAG, [this.authenticate.name, userName, password, strategyName]);

        const promise: Promise<string> = new Promise<string>((resolve, reject) => {
            if (this._strategies.length == 0) {
                const err = new AuthenticationError('No strategy defined for authentication.');
                this._log.error(TAG, err);
                reject(err);
            } else {
                const strategy: AuthenticationStrategy = this._strategies.find((s) => s.name === strategyName);

                if (!strategy) {
                    const err = new AuthenticationError(`No strategy found with name ${strategyName}.`);
                    this._log.error(TAG, err);
                    reject(err);
                } else {
                    strategy.authenticate(userName, password)
                        .then(() => {
                            const token = this._createToken(userName);
                            this._log.info(TAG, `Created a jwt '${token}' for the user ${userName}.`);
                            resolve(token);
                        }, (err) => {
                            if (err) {
                                this._log.error(TAG, `Failed to authenticated user ${userName}.`);
                            }

                            reject(err);
                        })
                        .catch((err: Error) => {
                            this._log.error(TAG, err);
                            reject(err);
                        });
                }
            }
        });

        return promise;
    }

    /**
     * Checks if the user (by userName) and it's token still valid.
     *
     * Returns a promise that resolves with the username or rejects with an Error.
     *
     * @param {string} username
     * @param {string} token
     * @returns {Promise<string>}
     * @memberof Authentication
     */
    public isAuthorized(username: string, token: string): Promise<string> {
        this._log.debug(TAG, [this.isAuthorized.name, token]);

        const promise = new Promise<string>((resolve, reject) => {
            jwt.verify(token, this._secret, (err: JsonWebTokenError | NotBeforeError | TokenExpiredError, decoded: any) => {
                if (err) {
                    if (err.name === 'TokenExpiredError') {
                        this._log.info(TAG, `Token expired for ${username}.\nError: ${err.message}`);
                    }

                    reject(err);
                } else {
                    resolve(decoded.username);
                }
            });
        });

        return promise;
    }

    private _createToken(username: string) {
        const token = jwt.sign({username: username}, this._secret, {
            expiresIn: this._expiresIn // seconds
        });

        return token;
    }
}

export default Authentication;
