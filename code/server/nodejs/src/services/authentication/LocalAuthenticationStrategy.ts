import AuthenticationStrategy from './AuthenticationStrategy';
import AuthenticationError from './AuthenticationError';
import Log from '../Log';

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
    private readonly _localUsers: Map<string, string>;
    private readonly _log: Log;
    private readonly _strategyName: string;
    constructor() {
        this._log = Log.getInstance();
        this._strategyName = LocalAuthenticationStrategy.name;
        this._localUsers = new Map<string, string>();
        this._localUsers.set('test', '12345');
        this._localUsers.set('msynk', '12345');
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

            const passwordFound: string = this._localUsers.get(username);

            if (passwordFound && password === passwordFound) {
                resolve();
            } else {
                const err = new AuthenticationError(`Invalid username (${username}) or password (${password})`);
                this._log.info(TAG, err.message);
                reject(err);
            }
        });

        return promise;
    }

    get strategyName(): string {
        return this._strategyName;
    }
}

export default LocalAuthenticationStrategy;
