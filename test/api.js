process.env.DB_FOLDER = 'memory';
process.env.TOKEN_SECRET = 'TOKEN_SECRET';

const config = require('../backend/config/api');
const User = require('../backend/models/users');
const app = require('../backend/app');

describe('API integration tests', () => {
  let server;

  before((done) => {
    app.on("appStarted", () => done());
    server = require('../backend/bin/www');
  });

  after(done => server.close(() => done()));

  describe('Integration tests', () => {
    require('./api/base')(app, config);
    require('./api/users')(app, config);
  });
});
