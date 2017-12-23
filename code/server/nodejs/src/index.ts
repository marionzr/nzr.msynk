import Cluster from './Cluster';
import Log from './services/Log';

const TAG: Log.TAG = new Log.TAG(__filename);

if (process.argv.length < 4 || process.argv[2] === '' || process.argv[3] === '') {
    const start = 
    `Invalid parameters. Usage: npm start port cpus envProperties
    port: the number of the port the server will be listening
    cpus: the number of cpus that can be used
    envFile [optional]: full filename of the .env.Properties`;
    console.error(start);
} else {
    process.env.PORT = process.argv[2];
    process.env.MAX_CPUS = process.argv[3];
    process.env.PROPERTIES_FILE = process.argv.length === 5 ? process.argv[4] : undefined;

    process.on('uncaughtException', (err) => {   
        Log.getInstance().error(TAG, `uncaughtException:' ${err.message}\nStack: ${err.stack}`); // logging with MetaData
    });

    process.on('beforeExit', (code: number) => {
        Log.getInstance().debug(TAG, `beforeExit with code ${code}`);
    });

    process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {                
        Log.getInstance().error(TAG, `Unhandled Rejection at: ${promise}, reason: ${reason}`);
    });
    
    process.on('exit', (code) => { 
        if (code > 0) {
            Log.getInstance().error(TAG, `exit with code ${code}`);
        } else {
            Log.getInstance().info(TAG, `exit with code ${code}`);
        }
    });

    Cluster.start();
}
