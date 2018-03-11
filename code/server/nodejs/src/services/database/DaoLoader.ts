import * as fs from 'fs';
import * as path from 'path';
import Log from '../../services/Log';
import Container from '../../services/container/Container';
import Util from '../Util';
import EnvProperties from '../EnvProperties';

const TAG: Log.TAG = new Log.TAG(__filename);

class DaoLoader {
    private readonly _log: Log;
    private _loaded: boolean = false;    
    constructor() {
        this._log = Log.getInstance();

        if (Util.isTestEnv) {
            EnvProperties.load();
        }
    }

    public load(baseDir: string): void {
        if (this._loaded) {
            return;
        }
        this._loadDao(baseDir);        
    }

    private static _addDao(daoDefinition: Function, dao: Function) {
        Container.getInstance().registry(daoDefinition, dao, false);
    }

    /**
     * Loads the DAO classes from a given base directory. This methods
     * executes recursively through nested directories.
     *
     * @private
     * @param {string} baseDir
     * @memberof DaoLoader
     */
    private _loadDao(baseDir: string): void {
        this._log.debug(TAG, [this._loadDao.name, baseDir]);
        // Get all files and directories names synchronously.
        const files: string[] = fs.readdirSync(baseDir);

        for (const file of files) {
            if (!fs.lstatSync(path.join(baseDir, file)).isDirectory() && (file.endsWith('.js') || file.endsWith('.ts'))) {
                const filaName = file.replace('.js', '').replace('.ts', '');
                // Ignores the DaoLoader and the LoaderEntryPoint that are in the same directory.

                if (filaName !== 'DaoLoader' && filaName.indexOf('LoaderEntryPoint') === -1) {
                    try {
                        this._log.info(TAG, `Loading class ${filaName}...`);
                        const dao = DaoLoader._fixPath(`${baseDir}${path.sep}${filaName}`);
                        const daoImpl = DaoLoader._fixPath(`${baseDir}${path.sep}${process.env.DB_TYPE}${path.sep}${filaName}Impl`);

                        eval(`
                            const ${filaName}_1 = require('${dao}');
                            const ${filaName}Impl_1 = require('${daoImpl}');
                            DaoLoader.${DaoLoader._addDao.name}(${filaName}_1.default, ${filaName}Impl_1.default);
                        `);
                    } catch (err) {
                        this._log.error(TAG, `eval error: ${err}\nDir: ${baseDir}`);
                    } finally {
                        this._log.debug(TAG, `Done loading class ${filaName}.`);
                    }
                }
            }
        }
    }

    private static _fixPath(fullFileName: string) { 
        fullFileName = fullFileName.replace(/\\/g, '/');
        return fullFileName;
    }
}

export default DaoLoader;

