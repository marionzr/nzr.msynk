if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'prod';
    console.warn('process.env.NODE_ENV was not defined');
}

import App from './App';
let app = new App();
app.start();

