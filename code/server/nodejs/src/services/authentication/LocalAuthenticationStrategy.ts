import AuthenticationStrategy from './AuthenticationStrategy'

class LocalAuthenticationStrategy implements AuthenticationStrategy {
    private readonly _localUsers: Map<string, string>;
    constructor() {
        this._localUsers = new Map<string, string>();
        this._localUsers.set('msynk', '12345');
        this._localUsers.set('ssannttoss', '12345');
    }

    public login(user: string, password: string): Promise<boolean> {
        const promise = new Promise<boolean>((resolve, reject) => {
            let passwordFound: string = this._localUsers.get(user);
            if (passwordFound && password === passwordFound) {
                resolve(true);
            } else {
                reject(new Error('Invalid login'));
            }
        });

        return promise;
    }

    get name(): string {
        return LocalAuthenticationStrategy.name
    }
}

export default LocalAuthenticationStrategy;