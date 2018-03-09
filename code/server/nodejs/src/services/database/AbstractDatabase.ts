import AbstractConnection from './AbstractConnection';
import DbType from './DbType';

abstract class AbstractDatabase {
    public abstract get dbType(): DbType;

    public abstract createConnection(): Promise<AbstractConnection>;
}

export default AbstractDatabase;
