import MsyDao from "../MsyDao";
import AbstractConnection from "../../../../services/database/AbstractConnection";
import MySQLAbstractDaoHelper from "../../../../services/database/mysql/MySQLAbstractDaoHelper";

class MsyDaoImpl extends MsyDao {
    private _helper: MySQLAbstractDaoHelper;
    
    constructor() {
        super('msy_config');
        this._helper = new MySQLAbstractDaoHelper(this.name);
    }

}

export default MsyDaoImpl;
