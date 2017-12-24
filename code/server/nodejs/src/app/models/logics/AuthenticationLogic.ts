import Authentication from '../../../services/authentication/Authentication';
import LocalAuthenticationStrategy from '../../../services/authentication/LocalAuthenticationStrategy';
import User from '../entities/User';

class AuthenticationLogic {
    private readonly _authentication: Authentication;
    constructor() {
        this._authentication = new Authentication('secret', 3000, new LocalAuthenticationStrategy());
    }

    public authenticate(user: User): Promise<User> {
        let promise = new Promise<User>((resolve, reject) => {
            this._authentication.login(user.name, user.password, LocalAuthenticationStrategy.name)
                .then((token) => {
                    let authenticatedUser = new User(user.name, user.password);
                    authenticatedUser.token = token;
                    resolve(authenticatedUser);
                })
                .catch((err) => {
                    console.log("err: " + err);
                    reject(err);
                });
        });

        return promise;
    }

    public isAuthenticated(user: User): Promise<boolean> {

        let promise = new Promise<boolean>((resolve, reject) => {
            this._authentication.isAuthorized(user.token)
                .then((decoded) => {
                    if (decoded === user.name) {
                        console.log('decoded');
                        resolve(true);
                    } else {
                        console.log('reject: ' + decoded);
                        reject();
                    }
                })
                .catch((err) => {
                    console.error(err);
                    reject(err);
                });
        });

        return promise;
    }
}

export default AuthenticationLogic;
