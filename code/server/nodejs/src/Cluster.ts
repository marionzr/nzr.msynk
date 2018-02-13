import * as cluster from 'cluster';
import * as os from 'os';
import App from './App';
import Log from './services/Log';
import EnvProperties from './services/EnvProperties';

const TAG: Log.TAG = new Log.TAG(__filename);

class Cluster {
    public static start(): void {
        EnvProperties.load();

        if (cluster.isMaster) {
            let maxCpus = parseInt(process.env.MAX_CPUS, 10);
            const cpus: os.CpuInfo[] = os.cpus();
            let online = 0;
            cluster.on('online', (worker: cluster.Worker) => {
                Log.getInstance().info(TAG, `Cluster: ${worker.process.pid} online.`);
            });

            cluster.on('listening', (worker: cluster.Worker) => {
                Log.getInstance().info(TAG, `Cluster: ${worker.process.pid} listening.`);
                online += 1;

                if (online === maxCpus) {
                    console.info(`Server listening on port ${process.env.PORT}.\nClusters:${online}\nVersion: ${App.VERSION}.`);                        
                    console.info('\t\tPress Ctrl+C to stop.');
                }                                     
            });

            cluster.on('disconnect', (worker: cluster.Worker) => {
                Log.getInstance().info(TAG, `Cluster: ${worker.process.pid} disconnected.`);
            });

            cluster.on('exit', (worker: cluster.Worker, code: number, signal: string) => {
                Log.getInstance().info(TAG, `Cluster: ${worker.process.pid} died -> ${signal || code}.`);
                online -= 1;
                cluster.fork();
            });

            if (!maxCpus || maxCpus > cpus.length) {
                maxCpus = cpus.length;
            }
            
            for (let i = 0; i < maxCpus; i += 1) {
                cluster.fork();
            }

            if (!process.env.NODE_ENV) {
                process.env.NODE_ENV = 'production';
            }
        } else {                        
            const app = new App();
            app.start();
            Log.getInstance().info(TAG, `Cluster: ${cluster.worker.process.pid} listening.`);
        }
    }

    public static restart(reason: string) {
        if (!cluster.isMaster) {
            console.log(`Restarting server. Reason: ${reason}`);
            cluster.worker.kill('-9');
        }
    }
}

export default Cluster;
