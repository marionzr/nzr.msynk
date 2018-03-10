import AbstractConnection from './AbstractConnection';

interface Dao {
    tableName: string;
    connection: AbstractConnection;
}

export default Dao;
