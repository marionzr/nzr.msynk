import AuthenticationStrategy from './AuthenticationStrategy';
import {JsonWebTokenError, NotBeforeError, TokenExpiredError} from 'jsonwebtoken';
import * as jwt from 'jsonwebtoken';
import { resolve } from 'path';
import LocalAuthenticationStrategy from './LocalAuthenticationStrategy';
import Log from '../Log';
const TAG: Log.TAG  = new Log.TAG(__filename);

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

    public login(user: string, password: string, strategyName: string): Promise<string> {
        this._log.info(TAG, [this.login.name, user, password, strategyName]);

        const promise: Promise<string> = new Promise<string>((resolve, reject) => {
            if (this._strategies.length == 0) {
                reject(new Error('No strategy defined for authentication'));
            } else {
                const strategy: AuthenticationStrategy = this._strategies.find((s) => s.name === strategyName);
                if (!strategy) {
                    reject(new Error(`No strategy found with name ${strategyName}`));
                } else {
                    strategy.login(user, password)
                        .then((userFound) => {
                            const token = this.createToken(user);
                            resolve(token);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                }
            }
        });

        return promise;
    }

    public isAuthorized(token: string): Promise<string> {
        this._log.info(TAG, [this.isAuthorized.name, token]);

        const promise = new Promise<string>((resolve, reject) => {
            jwt.verify(token, this._secret, function(err: JsonWebTokenError | NotBeforeError | TokenExpiredError, decoded: any) {
                if (err) {
                    reject(err);
                } else {
                    resolve(decoded.login);
                }
            });
        });

        return promise;
    }

    private createToken(user: string) {
        const token = jwt.sign({login: user}, this._secret, {
            expiresIn: this._expiresIn // seconds
        });

        return token;
    }
}

export default Authentication;