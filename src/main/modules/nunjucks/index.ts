import * as path from 'path';

import * as express from 'express';
import * as nunjucks from 'nunjucks';

export class Nunjucks {
  constructor(public developmentMode: boolean) {
    this.developmentMode = developmentMode;
  }

  enableFor(app: express.Express): void {
    app.set('view engine', 'njk');
    const env = nunjucks.configure(path.join(__dirname, '..', '..', 'views'), {
      autoescape: true,
      watch: this.developmentMode,
      express: app,
    });

    app.use((req, res, next) => {
      res.locals.pagePath = req.path;
      next();
    });

    env.addFilter('findError', function (errors, fieldName) {
      if (!errors) {
        return null;
      }
      const error = errors.find((err: { href: string }) => err.href === `#${fieldName}`);
      if (!error) {
        return null;
      }
      return { text: error.text };
    });
  }
}
