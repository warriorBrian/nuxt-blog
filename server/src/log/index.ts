import {getLogger, configure} from 'log4js';
configure({
  "appenders": {
    // "access": {
    //   "type": "dateFile",
    //   "filename": "log/access.log",
    //   "pattern": "-yyyy-MM-dd",
    //   "category": "http"
    // },
    // "app": {
    //   "type": "file",
    //   "filename": "log/app.log",
    //   "maxLogSize": 10485760,
    //   "numBackups": 3
    // },
    "success": {
      "type": "logLevelFilter",
      "level": "INFO",
      "maxLevel": "INFO",
      "appender": "successFile"
    },
    "successFile": {
      "type": "file",
      "filename": "log/access.log",
      "maxLogSize": 10485760,
      "numBackups": 3
    },
    "errorFile": {
      "type": "file",
      "filename": "log/errors.log"
    },
    "errors": {
      "type": "logLevelFilter",
      "level": "ERROR",
      "appender": "errorFile"
    },
    "console": {
      "type": 'console'
    }
  },
  "categories": {
    "default": {"appenders": ["console"], "level": "ALL"},
    "http": { "appenders": ["success", 'console', 'errors'], "level": "DEBUG" },
    "console": { "appenders": ["console"], "level": "ALL" },
  }
});

export const Logger = (category?: string) => getLogger(category);
