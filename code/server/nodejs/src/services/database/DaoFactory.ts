import * as fs from 'fs';
import * as path from 'path';
import Container from '../../services/container/Container';
import Log from '../../services/Log';
import AbstractDao from './AbstractDao';
import DaoLoader from './DaoLoader';
import DaoLoaderEntryPoint from '../../app/models/daos/DaoLoaderEntryPoint';
import MsyLocalUserDao from '../../app/models/daos/MsyLocalUserDao';
import MsyLocalUserDaoImpl from '../../app/models/daos/sqlite/MsyLocalUserDaoImpl';

const TAG: Log.TAG = new Log.TAG(__filename);

class DaoFactory {
    private _container: Container;
    private readonly _log: Log;
    private static _instance: DaoFactory;

    private constructor() {
        this._container = Container.getInstance();
        this._log = Log.getInstance();
        new DaoLoader().load(DaoLoaderEntryPoint);
        this.registry(MsyLocalUserDao, MsyLocalUserDaoImpl);
    }

    public static getInstance(): DaoFactory {
        if (!DaoFactory._instance) {
            DaoFactory._instance = new DaoFactory();
        }

        return DaoFactory._instance;
    }

    public registry(definition: Function, implementation: any) {        
        this._container.registry(definition, implementation, false);
    }

    public get<T extends AbstractDao>(definition: Function): T {        
        const dao: T = this._container.get(definition);
        return dao;
    }
}

export default DaoFactory.getInstance();
