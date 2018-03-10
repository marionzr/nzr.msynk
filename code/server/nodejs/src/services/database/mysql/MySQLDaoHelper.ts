import AbstractDaoHelper from '../AbstractDaoHelper';
import AbstractConnection from '../AbstractConnection';

class MySQLDaoHelper extends AbstractDaoHelper {
    constructor(connection?: AbstractConnection) {
        super(connection);
    }
}

export default MySQLDaoHelper;
