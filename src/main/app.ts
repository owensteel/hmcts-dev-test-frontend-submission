import * as path from 'path';

import { HTTPError } from './HttpError';
import { Nunjucks } from './modules/nunjucks';

import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import express from 'express';
import { glob } from 'glob';
import favicon from 'serve-favicon';

const { setupDev } = require('./development');

const env = process.env.NODE_ENV || 'development';
const developmentMode = env === 'development';

export const app = express();
app.locals.ENV = env;

new Nunjucks(developmentMode).enableFor(app);

app.use(favicon(path.join(__dirname, '/public/assets/images/favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Enable CSRF protection (tokens stored in cookies)
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// Make CSRF token available to all templates
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, max-age=0, must-revalidate, no-store');
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Auto-load routes
glob
  .sync(__dirname + '/routes/**/*.+(ts|js)')
  .map(filename => require(filename))
  .forEach(route => route.default(app));

setupDev(app, developmentMode);

app.use(
  // Express needs the NextFunction argument here for this middleware
  // to fire at all, even though we don't use it
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (err: HTTPError & { code?: string }, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    // default error handler
    console.error('Application error', err);
    res.locals.message = err.message;
    res.locals.error = env === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
  }
);
