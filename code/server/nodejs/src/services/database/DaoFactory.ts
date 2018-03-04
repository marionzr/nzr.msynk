import * as fs from 'fs';
import * as path from 'path';
import Container from "../../services/container/Container";
import Log from "../../services/Log";
import AbstractDao from '../../services/database/AbstractDao';

const TAG: Log.TAG = new Log.TAG(__filename);

class DaoFactory {
    private _container: Container;
    private readonly _log: Log;

    constructor() {
        this._log = Log.getInstance();        
    }

    public registry(definition: Function, implementation: AbstractDao) {        
        this._container.registry(definition, implementation, false);
    }

    public get(definition: Function): AbstractDao {
        return this._container.get(definition);
    }
}

export default DaoFactory;
