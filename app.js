/**
 * app.js
 * Use `app.js` to run your app.
 * To start the server, run: `node app.js`.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path:'.env' });
global.__basedir = __dirname;
require('./config/db');
const passport = require('passport');

let logger = require('morgan');
const { devicePassportStrategy } = require('./config/devicePassportStrategy');
const app = express();
const corsOptions = { origin: process.env.ALLOW_ORIGIN, };
app.use(cors(corsOptions));

app.use(require('./utils/response/responseHandler'));

//all routes 
const routes =  require('./routes');

devicePassportStrategy(passport);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(routes);

app.get('/', (req, res) => {
  res.render('index');
});

if (process.env.NODE_ENV !== 'test' ) {

  app.listen(process.env.PORT,()=>{
    console.log(`your application is running on ${process.env.PORT}`);
  });
} else {
  module.exports = app;
}
