import AbstractDao from '../../../services/database/AbstractDao';
import AbstractConnection from '../../../services/database/AbstractConnection';

abstract class MsyDao extends AbstractDao {
    constructor(name: string) {
        super(name);
    }
}

export default MsyDao;
