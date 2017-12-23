import QueryResult from './QueryResult';
import QueryParameter from './QueryParameter';
import ConnectionState from './ConnectionState';

abstract class AbstractConnection {
    public abstract beginTransaction(): Promise<AbstractConnection>;

    public abstract commit(): Promise<any>;

    public abstract rollback(): Promise<any>;

    public abstract query(sql: string, ...queryParameters: Array<QueryParameter>): Promise<QueryResult>;

    public abstract close(): Promise<any>;

    state: ConnectionState;
}

export default AbstractConnection;
