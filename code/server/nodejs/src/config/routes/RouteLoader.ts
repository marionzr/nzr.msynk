import * as fs from 'fs';
import * as path from 'path';
import AbstractRoute from './AbstractRoute';
import Log from '../../services/Log';
import Util from '../../services/Util';

const TAG: Log.TAG = new Log.TAG(__filename);

/**
 * A consign like house implementation to loads the Route classes.
 *
 * @class RouteLoader
 */
class RouteLoader {
    private readonly _log: Log;
    private readonly _routes: Array<AbstractRoute>;

    constructor() {
        this._routes = [];
        this._log = Log.getInstance();
    }

    /**
     * Adds a loaded route into the array. Test routes will only
     * add added if the server is running int test mode.
     *
     * @private
     * @param {AbstractRoute} route
     * @memberof RouteLoader
     */
    private _addRoute(route: AbstractRoute): void {
        if (route && !(route instanceof AbstractRoute)) {
            this._log.warn(TAG, `${JSON.stringify(route)} is not subclass of AbstractRoute.`);
        }

        if (!route.testingRoute || Util.isTestEnv()) {
            this._routes.push(route);
        }
    }

    /**
     * Loads the route classes from a given base directory. This methods
     * executes recursively through nested directories.
     *
     * @private
     * @param {string} baseDir
     * @memberof RouteLoader
     */
    private _loadRoutes(baseDir: string): void {
        this._log.debug(TAG, [this._loadRoutes.name, baseDir]);

        // Get all files and directories names synchronously.
        const files: string[] = fs.readdirSync(baseDir);

        for (const file of files) {
            if (fs.lstatSync(path.join(baseDir, file)).isDirectory()) {
                // If is a nested directory, enter this methods recursively.
                this._loadRoutes(path.join(baseDir, file));
            } else {
                if (!file.endsWith('.js') && !file.endsWith('.ts')) {
                    continue; // Only javascript and typescript files are allowed. It ignores files like *.map
                }

                const importStm: any = this._getImportStm(path.join(baseDir, file));

                if (importStm.className === 'RouteLoader' || importStm.className === 'AbstractRoute') {
                    continue; // Ignores the RouteLoader and the AbstractRouter that are in the same directory.
                }

                try {
                    this._log.info(TAG, `Loading class ${importStm.className}...`);
                    eval(`
                        const ${importStm.className}_1 = require("./${importStm.import}");
                        this._addRoute(new ${importStm.className}_1.default());
                    `);
                } catch (err) {
                    this._log.error(TAG, `eval error: ${err}\nDir: ${baseDir}`);
                } finally {
                    this._log.debug(TAG, `Done loading class ${importStm.className}.`);
                }
            }
        }
    }

    /**
     * Gets the import string for require('import') class.
     *
     * It gets the full file name from root (C:\ or \) and removes the
     * parent directories until the base directory.
     *
     * @private
     * @static
     * @param {string} fullFileName
     * @returns {{}}
     * @memberof RouteLoader
     */
    private _getImportStm(fullFileName: string): { } {
        this._log.debug(TAG, [this._getImportStm.name, fullFileName]);

        fullFileName = fullFileName.replace('.js', '').replace('.ts', '');
        const importStm = { className: '', import: '' };

        if (path.sep === '\\') {
            importStm.className = fullFileName.replace(/.+\\/, '');
        } else if (path.sep === '\/') {
            importStm.className = fullFileName.replace(/.+\//, '');
        } else {
            throw new Error(`Unknown path separator: ${path.sep}`);
        }

        const directoryTree = fullFileName.split(path.sep).slice(0, -1).reverse();
        const baseDir = __dirname.split(path.sep).reverse()[0];
        const importDir: Array<string> = [];
        for (const currDir of directoryTree) {
            if (currDir === baseDir) {
                break;
            }

            importDir.push(currDir);
        }

        importStm.import = `./${importDir.reverse().join('/')}/${importStm.className}`;
        return importStm;
    }

    /**
     * Loads all the routes in the RouteLoader directory (including nestes ones).
     * It returns the routes but it is also provided by the route property.
     *
     * @returns {Array<AbstractRoute>}
     * @memberof RouteLoader
     */
    public load(): Array<AbstractRoute> {
        this._loadRoutes(__dirname);
        return this.routes;
    }

    public get routes(): Array<AbstractRoute> {
        return this._routes;
    }
    
    static routesJSON(routes: Array<AbstractRoute>): any {
        let routeDescription = routes.map(i => `{ 'path':'${i.path}', 'verbs':'${
            ( (i.routeGet() != null ? "GET," :  "") + 
              (i.routePost() != null ? "POST," :  "") + 
              (i.routePatch() != null ? "PATCH," :  "") + 
              (i.routeDelete() != null ? "DELETE," :  "")).slice(0, -1).trim()
        }' }`);
        
        return JSON.stringify(routeDescription);
    }
}

export default RouteLoader;
