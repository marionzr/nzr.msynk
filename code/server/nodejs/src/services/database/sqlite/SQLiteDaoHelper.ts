import AbstractDaoHelper from '../AbstractDaoHelper';
import AbstractConnection from '../AbstractConnection';

class SQLiteDaoHelper extends AbstractDaoHelper {
    constructor(connection?: AbstractConnection) {
        super(connection);
    }
}

export default SQLiteDaoHelper;
