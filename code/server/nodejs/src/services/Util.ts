import * as path from 'path';
import { basename } from 'path';

class Util {
    constructor() {

    }

    static isTestEnv(): boolean {
        return process.env.NODE_ENV && (
            process.env.NODE_ENV.trim() === 'tst' || process.env.NODE_ENV.trim() === 'test');
    }

    static isDevEnv(): boolean {
        return process.env.NODE_ENV && (
            process.env.NODE_ENV.trim() === 'dev' || process.env.NODE_ENV.trim() === 'development');
    }

    static isProductionEnv(): boolean {
        return !process.env.NODE_ENV || process.env.NODE_ENV.trim() === 'prod' ||
            process.env.NODE_ENV.trim() === 'production';
    }

    static getBaseName(fileName: string): string {
        let baseName: string = path.basename(fileName);
        return baseName;
    }
}

export default Util;