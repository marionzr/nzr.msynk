import Entity from './Entity';

class User extends Entity{
    private readonly _name: string;
    private readonly _password: string;

    constructor(name: string, password: string) {
        super();
        this._name = name;
        this._password = password;
    }

    public get name(): string {
        return this._name;
    }

    public get password(): string {
        return this._password;
    }
}

export default User;
