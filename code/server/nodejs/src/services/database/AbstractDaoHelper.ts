import AbstractConnection from './AbstractConnection';
import QueryParameter from './QueryParameter';
import QueryResult from './QueryResult';
import ColumnInfo from './ColumnInfo';

abstract class AbstractDaoHelper {
    private readonly _tableName: string;
    private _connection: AbstractConnection;
    private readonly _queryParameters: QueryParameter[];
    constructor(tableName: string) {
        this._tableName = tableName;
        this._queryParameters = [];
    }

    public get connection(): AbstractConnection {
        return this._connection;
    }

    public set connection(connection: AbstractConnection) {
        this._connection = connection;
    }

    public get tableName(): string {
        return this._tableName;
    }

    protected abstract executeQuery(sql: string, queryParameters: Array<QueryParameter>): Promise<QueryResult>;

    protected abstract executeNonQuery(sql: string, queryParameters: Array<QueryParameter>): Promise<QueryResult>;

    protected abstract executeScalar(sql: string, resultAlias: string, queryParameters: QueryParameter[]): Promise<number>;

    protected addParameter<T>(value: T, columnInfo?: ColumnInfo): QueryParameter {
        const queryParameter = new QueryParameter(value, columnInfo);
        this._queryParameters.push(queryParameter);
        return queryParameter;
    }

    protected clearParameters(): void {
        this._queryParameters.splice(0, this._queryParameters.length);
    }

    protected get queryParameters(): QueryParameter[] {
        return this._queryParameters;
    }

    protected noConnectionError(): Error {
        return new Error(`${this.tableName}: Connection is closed or undefined. Use connection property to set a connection`);
    }
}

export default AbstractDaoHelper;
