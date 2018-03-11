import MsyDao from '../MsyDao';
import AbstractConnection from '../../../../services/database/AbstractConnection';
import MySQLDaoHelper from '../../../../services/database/mysql/MySQLDaoHelper';

class MsyDaoImpl extends MsyDao {
    private _helper: MySQLDaoHelper;
    
    constructor() {
        super('msy_config');
        this._helper = new MySQLDaoHelper(this);
    }
}

export default MsyDaoImpl;
