import * as path from 'path';

/**
 * Util static class with some util methods.
 *
 * @class Util
 */
class Util {
    constructor() {

    }

    /**
     * Checks it the process.env.NODE is set as Test (tst or test).
     *
     * @static
     * @returns {boolean}
     * @memberof Util
     */
    static isTestEnv(): boolean {
        return process.env.NODE_ENV && (
            process.env.NODE_ENV.trim() === 'tst' || process.env.NODE_ENV.trim() === 'test');
    }

    /**
     * Checks it the process.env.NODE is set as Desenv (dev or development).
     *
     * @static
     * @returns {boolean}
     * @memberof Util
     */
    static isDevEnv(): boolean {
        return process.env.NODE_ENV && (
            process.env.NODE_ENV.trim() === 'dev' || process.env.NODE_ENV.trim() === 'development');
    }

    /**
     * Checks it the process.env.NODE is set as Production (prod or production)
     *
     * @static
     * @returns {boolean}
     * @memberof Util
     */
    static isProductionEnv(): boolean {
        return !process.env.NODE_ENV || process.env.NODE_ENV.trim() === 'prod' ||
            process.env.NODE_ENV.trim() === 'production';
    }

    /**
     * Wrapper to path.basename.
     *
     * Return the last portion of a path. Similar to the Unix basename command.
     * Often used to extract the file name from a fully qualified path.
     *
     * @paramfileNamep the path to evaluate.
     * @param ext optionally, an extension to remove from the result.
     */
    static getBaseName(fileName: string, ext?: string): string {
        const baseName: string = path.basename(fileName, ext);
        return baseName;
    }
}

export default Util;
