import AbstractDaoHelper from '../AbstractDaoHelper';
import AbstractConnection from '../AbstractConnection';
import AbstractDao from '../AbstractDao';
import SQLiteDatabase from './SQLiteDatabase';
import ConnectionState from '../ConnectionState';

class SQLiteDaoHelper extends AbstractDaoHelper {
    constructor(onConnectionChangeLister: AbstractDao.OnConnectionChangeListener) {
        super(onConnectionChangeLister);
    }

    public requestConnection(): Promise<AbstractConnection> {
         if (super.connection && super.connection.state === ConnectionState.connected) {
             return Promise.resolve(super.connection);
         } 

         return SQLiteDatabase.instance.createConnection();
    }
}

export default SQLiteDaoHelper;
