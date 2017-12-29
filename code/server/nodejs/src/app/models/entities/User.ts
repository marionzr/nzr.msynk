import Entity from './Entity';

class User extends Entity {
    private readonly _username: string;
    private readonly _password: string;

    constructor(name: string, password: string) {
        super();
        this._username = name;
        this._password = password;
    }

    public get username(): string {
        return this._username;
    }

    public get password(): string {
        return this._password;
    }
}

export default User;
