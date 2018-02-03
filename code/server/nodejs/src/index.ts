import App from './App';

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'prod';
}

const app = new App();
app.start();
