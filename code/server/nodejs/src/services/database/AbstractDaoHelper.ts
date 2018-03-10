import AbstractConnection from './AbstractConnection';
import QueryParameter from './QueryParameter';
import QueryResult from './QueryResult';
import ColumnInfo from './ColumnInfo';

abstract class AbstractDaoHelper {
    private _connection: AbstractConnection;
    private readonly _queryParameters: QueryParameter[];
    constructor(connection?: AbstractConnection) {
        this._connection = connection;
        this._queryParameters = [];
    }

    public get connection(): AbstractConnection {
        return this._connection;
    }

    public set connection(connection: AbstractConnection) {
        this._connection = connection;
    }

    public executeQuery(sql: string): Promise<QueryResult> {
        if (!this._connection) {
            return Promise.reject(this.noConnectionError());
        }

        return this.connection.query(sql, ...this._queryParameters);            
    }

    public executeNonQuery(sql: string): Promise<QueryResult> {
        if (!this._connection) {
            return Promise.reject(this.noConnectionError());
        }

        return this.connection.query(sql, ...this._queryParameters);
    }

    public executeScalar(sql: string, resultAlias: string): Promise<number> {
        if (!this._connection) {
            return Promise.reject(this.noConnectionError());
        }

        const promise = new Promise<number>((resolve, reject) => {
            this.connection.query(sql, ...this._queryParameters)
            .then((result: QueryResult) => {
                result.rows[0].resultAlias;
            }, (err) => {
                reject(err);
            });
        });

        return promise;
    }

    public addParameter<T>(value: T, columnInfo?: ColumnInfo): QueryParameter {
        const queryParameter = new QueryParameter(value, columnInfo);
        this._queryParameters.push(queryParameter);
        return queryParameter;
    }

    public clearParameters(): void {
        this._queryParameters.splice(0, this._queryParameters.length);
    }

    public get queryParameters(): QueryParameter[] {
        return this._queryParameters;
    }

    public noConnectionError(): Error {
        return new Error(`${this}: Connection is closed or undefined. Use connection property to set a connection`);
    }
}

export default AbstractDaoHelper;
