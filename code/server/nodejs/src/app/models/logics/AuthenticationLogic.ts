import Authentication from '../../../services/authentication/Authentication';
import LocalAuthenticationStrategy from '../../../services/authentication/LocalAuthenticationStrategy';
import User from '../entities/User';
import Log from '../../../services/Log';
const TAG: Log.TAG  = new Log.TAG(__filename);

class AuthenticationLogic {
    private readonly _authentication: Authentication;
    private readonly _log: Log;
    constructor() {
        this._authentication = new Authentication('secret', 3000, new LocalAuthenticationStrategy());
        this._log = Log.getInstance();
    }

    /**
     * Perform user authentication.
     *
     * Returns a promise that resolves with a token to be used in the next requests
     * or rejects
     *
     * @param {User} user
     * @returns {Promise<string>}
     * @memberof AuthenticationLogic
     */
    public authenticate(user: User): Promise<string> {
        this._log.debug(TAG, [this.authenticate.name, user]);

        let promise = new Promise<string>((resolve, reject) => {
            this._authentication.authenticate(user.name, user.password, LocalAuthenticationStrategy.name)
                .then((token) => {
                    this._log.info(TAG, `User ${user.name} authenticated. Token: ${token}.`);
                    resolve(token);
                }, (err: Error) => {
                    if (err) {
                        this._log.error(TAG, err);
                    }

                    this._log.info(TAG, `User ${user.name} authentication failed.`);
                    reject(err);
                })
                .catch((err) => {
                    this._log.error(TAG, err);
                    reject(err);
                });
        });

        return promise;
    }

    public isAuthenticated(user: User, token: string): Promise<string> {
        this._log.debug(TAG, [this.isAuthenticated.name, user]);

        let promise = new Promise<any>((resolve, reject) => {
            this._authentication.isAuthorized(user.name, token)
                .then((userName) => {
                    if (userName === user.name) {
                        resolve(userName);
                    } else {
                        let err = new Error(`Invalid decoded username ${userName} for user ${user.name}.`);
                        this._log.error(TAG, err);
                        reject(err);
                    }
                }, (err) => {
                    reject(err);
                })
                .catch((err) => {
                    this._log.error(TAG, err);
                    reject(err);
                });
        });

        return promise;
    }
}

export default AuthenticationLogic;
