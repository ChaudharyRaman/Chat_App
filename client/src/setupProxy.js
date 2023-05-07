const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      // 👇️ make sure to update your target
      target: 'https://chat-app-backend-qmli.onrender.com',
      changeOrigin: true,
    }),
  );
};
