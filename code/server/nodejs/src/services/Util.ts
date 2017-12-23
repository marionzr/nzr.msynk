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
}

export default Util;