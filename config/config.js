var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var secret = 'pourlesfreresdu1260etdailleurs'

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'haveatalk'
    },
    'secret': 'devdacticIsAwesome',
    port: 3000,
    db: 'mongodb://localhost/haveatalk-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'haveatalk'
    },
    'secret': 'devdacticIsAwesome',
    port: 3000,
    db: 'mongodb://localhost/haveatalk-test'
  },

  production: {
    secret: 'test',
    root: rootPath,
    app: {
      name: 'haveatalk'
    },
    port: process.env.PORT,
    db: process.env.MONGODB_URI || 'mongodb://localhost/haveatalk-development'
  }
};

module.exports = config[env];
