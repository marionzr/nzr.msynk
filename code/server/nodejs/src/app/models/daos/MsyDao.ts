import Dao from '../../../services/database/Dao';
import AbstractConnection from '../../../services/database/AbstractConnection';

abstract class MsyDao implements Dao {
    private readonly _name: string;
    private _connection: AbstractConnection;

    constructor(name: string) {
        this._name = name;
    }
    
    public get tableName(): string {
        return this._name;
    }

    public set connection(connection: AbstractConnection) {
        this._connection = connection;
    }

    public get connection() {
        return this._connection;
    }
}

export default MsyDao;
