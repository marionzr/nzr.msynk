import AbstractConnection from './AbstractConnection';
import QueryParameter from './QueryParameter';
import QueryResult from './QueryResult';
import ColumnInfo from './ColumnInfo';
import AbstractDao from './AbstractDao';

abstract class AbstractDaoHelper {
    private _connection: AbstractConnection;
    private readonly _queryParameters: QueryParameter[];
    constructor(connectionChangeLister: AbstractDao.OnConnectionChangeListener) {
        connectionChangeLister.onChange((connection: AbstractConnection) => {
            this._connection = connection;
        });

        this._queryParameters = [];
    }

    public get connection(): AbstractConnection {
        return this._connection;
    }

    public set connection(connection: AbstractConnection) {
        this._connection = connection;
    }

    public requestConnection(): Promise<AbstractConnection> {
        return Promise.resolve(this._connection);        
    }

    public executeQuery(sql: string): Promise<QueryResult> {  
        const queryParameters = this.queryParameters.slice();
        this.clearParameters();

        const promise = new Promise<QueryResult>((resolve, reject) => {
            this.requestConnection()
            .then((connection: AbstractConnection) => {
                if (!connection) {
                    reject(this.noConnectionError());
                }

                connection.query(sql, ...queryParameters)
                .then((result: QueryResult) => {
                    resolve(result);
                }, (err) => {
                    reject(err);
                });
            }, (err) => {
                reject(err);
            });
        });

        return promise;
    }

    public executeNonQuery(sql: string): Promise<QueryResult> {
       return this.executeQuery(sql);
    }

    public executeScalar(sql: string, resultAlias: string): Promise<number> {
        const queryParameters = this.queryParameters.slice();
        this.clearParameters();

        const promise = new Promise<number>((resolve, reject) => {
            this.requestConnection()
            .then((connection: AbstractConnection) => {
                if (!connection) {
                    reject(this.noConnectionError());
                }

                connection.query(sql, ...queryParameters)
                .then((result: QueryResult) => {
                    const scalar: number = result.rows[0].resultAlias;
                    resolve(scalar);
                }, (err) => {
                    reject(err);
                });
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
