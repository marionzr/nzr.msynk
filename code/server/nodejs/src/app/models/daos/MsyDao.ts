import Dao from '../../../services/database/Dao';

abstract class MsyDao implements Dao {
    private readonly _name: string;

    constructor(name: string) {
        this._name = name;
    }
    
    public get tableName(): string {
        return this._name;
    }
}

export default MsyDao;
