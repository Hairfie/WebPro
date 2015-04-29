if (process.env.NEW_RELIC_LICENSE_KEY) {
    require('newrelic');
}

// Register babel to have ES6 support on the server
require('babel/register')({stage: 0});

// Start the server app
require('./src/server');
