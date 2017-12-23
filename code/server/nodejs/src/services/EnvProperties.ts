import * as dotenv from 'dotenv';
import * as fs from 'fs';
import Log from './Log';
import Util from './Util';

class EnvProperties {
    constructor() {

    }

    /**
     * Loads the .env.properties files. 
     * First if checks if a file was provided as argument to npm start.
     * If not provided, then checks if a user file was been uploaded
     * If not uploaded, then uses the default ./src/config/.env.properties
     */
    public static load() {
        let file = './.env.properties'; // default properties file
        if (process.env.PROPERTIES_FILE && fs.existsSync(process.env.PROPERTIES_FILE)) {
            file = process.env.PROPERTIES_FILE;
            if (Util.isDevEnv()) {
                console.info('Using process.env.PROPERTIES_FILE');
            }
        } else if (!fs.existsSync(file)) {
            if (Util.isDevEnv()) {
                console.info('Using default');
            }
            file = './src/config/.env.properties'; // default properties file
        } else {
            if (Util.isDevEnv()) {
                console.info('Using custom .env.properties files');
            }
        }

        try {
            const result: dotenv.DotenvResult = dotenv.config({ path: file });
            const config = result.parsed;

            if (config) {
                for (const key in config) {
                    if (Object.prototype.hasOwnProperty.call(config, key)) {
                        process.env[key] = config[key];
                    } else {
                        console.error(`config do not have property ${key}`);
                    }
                }
            }

            EnvProperties.validate(result);
        } catch (err) {
            console.error('Invalid .env.properties files. Using default');
            file = './src/config/.env.properties'; // default properties file
            dotenv.config({ path: file });
        }
    }

    public static validate(result: dotenv.DotenvResult) {
        if (result.error) {
            throw result.error;
        } else if (!process.env.LOG_LEVEL || !process.env.BODY_PARSER_JSON_LIMIT || 
            !process.env.MADMIN_PASSWORD) {
                throw new Error();
        }
    }
}

export default EnvProperties;
