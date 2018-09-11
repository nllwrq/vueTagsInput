const proxyMiddleware = require('http-proxy-middleware');

const proxyJsonConfig = require('../config/proxy-json');
const config = require('../config');
const { proxyTable, proxyJson } = config.dev;

const proxyRemote = app => {
  if (!proxyTable) return;
  Object.keys(proxyTable).forEach(context => {
    let options = proxyTable[context];
    if (typeof options === 'string') {
      options = { target: options }
    }else{
      context = options.context;
      options = {target: options.target}
    }
    options.changeOrigin = true;
    options.proxyTimeout = 50000;
    app.use(proxyMiddleware(options.filter || context, options));
  });
};
const proxyLocal = app => {
  if (!proxyJson) return;
  app.use('/', (req, res, next) => {
    const { originalUrl } = req;
    const pathname = originalUrl
      .split('?')[0]
      .trim()
      .replace(/\/\d+/, '/');
    const rs = proxyJsonConfig[pathname];
    if (!rs) next();
    res.json(rs);
  });
};
module.exports = app => {
  proxyRemote(app);
  proxyLocal(app);
};
