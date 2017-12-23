import AbstractRoute from './AbstractRoute';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';
import Log from '../../services/Log';
import Util from '../../services/Util';
const TAG: Log.TAG  = new Log.TAG(__filename);

class RouteLoader {
    private readonly _log: Log;
    private readonly _routes: Array<AbstractRoute> = new Array<AbstractRoute>();

    constructor(log: Log) {
        this._log = log;
    }

    private addRoute(route: AbstractRoute): void {
        if (!route.testingRoute || Util.isTestEnv()) {
            this._routes.push(route);
        }
    }

    private loadRoutes(baseDir: string): void {
        let files: string[] = fs.readdirSync(baseDir);

        for(let file of files) {
            if (fs.lstatSync(path.join(baseDir, file)).isDirectory()) {
                this.loadRoutes(path.join(baseDir, file));
            } else {
                if (!file.endsWith('.js') && !file.endsWith('.ts')) {
                    continue;
                }

                let importStm: any = RouteLoader.getImportStm(path.join(baseDir, file));

                if (importStm.className === 'RouteLoader' || importStm.className == 'AbstractRoute') {
                    continue;
                }

                try {
                    this._log.info(TAG, `Loading class ${importStm.className}...`);
                    eval(`
                        const ${importStm.className}_1 = require("./${importStm.import}");
                        this.addRoute(new ${importStm.className}_1.default());
                    `);
                } catch (err) {
                    this._log.error(TAG, `eval error: ${err}\nDir: ${baseDir}`);
                } finally {
                    this._log.debug(TAG, `Done loading class ${importStm.className}`);
                }
            }
        }
    }

    private static getImportStm(fullFileName: string): {} {
        fullFileName = fullFileName.replace('.js','').replace('.ts', '');
        let importStm = { 'className': '', 'import': ''};

        if (path.sep == '\\') {
            importStm.className = fullFileName.replace(/.+\\/, '');
        } else if (path.sep == '\/') {
            importStm.className = fullFileName.replace(/.+\//, '');
        } else {
            throw new Error(`Unknown path separator: ${path.sep}`);
        }

        let directoryTree = fullFileName.split(path.sep).slice(0, -1).reverse();
        let baseDir = __dirname.split(path.sep).reverse()[0];
        let importDir: Array<string> = new Array<string>();
        for(let currDir of directoryTree) {
            if (currDir === baseDir) {
                break;
            }

            importDir.push(currDir);
        }
        importStm.import = './' + importDir.reverse().join('/') + '/' + importStm.className;
        return importStm;
    }

    public load(): Array<AbstractRoute> {
        this.loadRoutes(__dirname);
        return this.routes;
    }

    public get routes(): Array<AbstractRoute> {
        return this._routes;
    }
}

export default RouteLoader;
