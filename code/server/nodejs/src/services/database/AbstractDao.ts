import { EventEmitter } from 'events';
import AbstractConnection from './AbstractConnection';

abstract class AbstractDao implements AbstractDao.OnConnectionChangeListener {
    private _tableName: string;
    private _connection: AbstractConnection;
    private _eventEmitter: EventEmitter;
    private static ON_CONNECTION_CHANGE_EVENT = 'ON_CONNECTION_CHANGE_EVENT';

    constructor(tableName: string, connection?: AbstractConnection) {        
        this._tableName = tableName;
        this._connection = connection;
        this._eventEmitter = new EventEmitter();
    }

    public get tableName(): string {
        return this._tableName;
    }

    public set connection(connection: AbstractConnection) {
        this._connection = connection;
        this._eventEmitter.emit(AbstractDao.ON_CONNECTION_CHANGE_EVENT, connection);
    }

    public get connection(): AbstractConnection {
        return this._connection;
    }

    public onChange(listener: (connection: AbstractConnection) => void) {
        this._eventEmitter.on(AbstractDao.ON_CONNECTION_CHANGE_EVENT, (...args: any[]) => {
            listener(args !== null ? args[0] : null);
        });
    }
}

module AbstractDao {
    export interface OnConnectionChangeListener {
        onChange(listener: (connection: AbstractConnection) => void): void;
    }
}

export default AbstractDao;
