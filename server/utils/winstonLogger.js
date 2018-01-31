var moment = require('moment');
var winston = require('winston');

// winston logger setup
var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: () => {
        return moment().format();
      },
      formatter: (options) => {
        // Return string will be passed to logger. 
        return options.timestamp() + winston.config.colorize(options.level, ' [' + options.level.toUpperCase() + '] ') + (options.message ? options.message : '') +
          (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
      },
      level: 'silly',
      colorize: true
    }),
    new (winston.transports.File)({
      timestamp: () => {
        return moment().format();
      },
      name: 'info-file',
      filename: 'server/logs/filelog-info.log',
      level: 'info'
    }),
    new (winston.transports.File)({
      timestamp: () => {
        return moment().format();
      },
      name: 'verbose-file',
      filename: 'server/logs/filelog-verbose.log',
      level: 'verbose'
    }),
    new (winston.transports.File)({
      timestamp: () => {
        return moment().format();
      },
      name: 'error-file',
      filename: 'server/logs/filelog-error.log',
      level: 'error'
    })
  ]
});

module.exports = logger;