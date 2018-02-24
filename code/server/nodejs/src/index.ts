import Cluster from './Cluster';

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
    Cluster.start();
}
