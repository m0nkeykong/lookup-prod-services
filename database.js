require('dotenv').config();
const consts = require('./consts'),
      mongoose = require('mongoose');
      mongoose.Promise = global.Promise;

// Connect to database with auto-reonnect enabled
mongoose.connect(consts.MLAB_KEY, {dbName: 'testDB', autoReconnect: true, useNewUrlParser: true});

// Get default connection
const conn = mongoose.connection;

mongoose.set('useCreateIndex', true);

// When successfully connected
conn.on('connected', () => {
    console.log('Mongoose default connection open to ' + consts.MLAB_KEY);
});

// If the connection throws an error
conn.on('error', (err) => {
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
conn.on('disconnected', () => {
    console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
    conn.close(() => {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});
