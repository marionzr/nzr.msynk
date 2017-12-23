if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'prod';
    console.warn('process.env.NODE_ENV was not defined');
}

import app from './App';
let server = app.server();
app.start();

