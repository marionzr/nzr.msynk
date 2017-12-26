/**
 * Interface to defined a way to authenticated users.
 *
 * @interface AuthenticationStrategy
 */
interface AuthenticationStrategy {
    /**
     * Performs users authentication through on strategy implementation.
     *
     * Returns a promise that resolves the authentication is valid and rejects otherwise.
     * If the authentication fail then the promise will reject with an AuthenticationError
     *
     * @param {string} user
     * @param {string} password
     * @returns {Promise<string>}
     * @memberof AuthenticationStrategy
     */
    authenticate(user: string, password: string): Promise<string>;

    /**
     * Authentication strategy name.
     *
     * @type {string}
     * @memberof AuthenticationStrategy
     */
    name: string;
}

export default AuthenticationStrategy;
