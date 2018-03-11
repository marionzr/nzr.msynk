import AbstractDaoHelper from '../AbstractDaoHelper';
import AbstractConnection from '../AbstractConnection';
import AbstractDao from '../AbstractDao';

class MySQLDaoHelper extends AbstractDaoHelper {
    constructor(onConnectionChangeLister: AbstractDao.OnConnectionChangeListener) {
        super(onConnectionChangeLister);
    }
}

export default MySQLDaoHelper;
