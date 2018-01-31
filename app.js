// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
var debug = require('debug')('node-rest:server');
var logger = require('morgan');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var winstonLogger = require('./server/utils/winstonLogger');

const app = express();

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '8080';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`** API running on port: ${port}`));
server.timeout = 600000; // timeout to 10mins

// set up web socket 
var io = require('socket.io')(server);
app.set('socketio', io);

winstonLogger.stream({ start: -1 }).on('log', (log) => {
  if(log.transport[0] === 'verbose-file') {
    io.emit('log', log);
  }
});

// Get our API routes
const apiRoutes = require('./server/controllers/api');
const authRoutes = require('./server/controllers/auth');
const developerRoutes = require('./server/controllers/developers/developers');
const companyRoutes = require('./server/controllers/companies/companies');
const apiProductRoutes = require('./server/controllers/apiProducts/apiProducts');
const cacheRoutes = require('./server/controllers/caches/caches');
const kvmRoutes = require('./server/controllers/kvms/kvms');
const monetizationCurrencyRoutes = require('./server/controllers/monetizationCurrencies/monetizationCurrencies');
const monetizationPackageRoutes = require('./server/controllers/monetizationPackages/monetizationPackages');
const notificationRoutes = require('./server/controllers/notification-email-templates/notification-email-templates');
const proxyRoutes = require('./server/controllers/proxies/proxies');
const reportRoutes = require('./server/controllers/reports/reports');
const sharedflowRoutes = require('./server/controllers/sharedFlows/sharedFlows');
const targetServerRoutes = require('./server/controllers/targetServers/targetServers');
const userRoutes = require('./server/controllers/user');

// Parsers for POST data
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
  next();
});

// Set our api routes
app.use('/auth', authRoutes);
app.use('/apiProducts', apiProductRoutes);
app.use('/caches', cacheRoutes);
app.use('/developers', developerRoutes);
app.use('/companies', companyRoutes);
app.use('/kvms', kvmRoutes);
app.use('/monetizationCurrencies', monetizationCurrencyRoutes);
app.use('/monetizationPackages', monetizationPackageRoutes);
app.use('/notification-email-templates', notificationRoutes);
app.use('/proxies', proxyRoutes);
app.use('/reports', reportRoutes);
app.use('/sharedFlows', sharedflowRoutes);
app.use('/targetServers', targetServerRoutes);
app.use('/user', userRoutes);
app.use('/api', apiRoutes);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});