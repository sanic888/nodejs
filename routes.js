var authService = require('./api/auth/auth.service');
var fs = require('fs');
var config = require('./config');
var Handlebars  = require('handlebars');
var indexHtml = fs.readFileSync(config.spaIndexHtmlPath).toString();
var landingHtml = fs.readFileSync(config.spaLandingHtmlPath).toString();

var indexTemplate =  Handlebars.compile(indexHtml);
var landingTemplate =  Handlebars.compile(landingHtml);

Handlebars.registerHelper('json', function(obj) {
  return JSON.stringify(obj);
});

module.exports = function(app) {
  app.use('/api/v1/users', require('./api/user/router'));
  app.use('/api/v1/apps', require('./api/apps/router'));
  app.use('/api/v1/sources', require('./api/sources/router'));
  app.use('/api/v1/spendings', require('./api/spendings/router'));
  app.use('/api/v1/payments', require('./api/payments/router'));
  app.use('/api/v1/stripe', require('./api/stripe/router'));

  app.use('/auth', require('./api/auth'));
  app.route('/verify-email/:token')
    .get(require('./api/user/index').verify);

  //mapLandingPageRoutes(app);

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
    .get(function(req, res){
      res.status(404);
      res.render('404');
    });

  // All other routes should return index.html
  app.route('/*')
    .get(function(req, res) {
      //if user is authenticated -- return single page main file
      if(req.isAuthenticated()){
        var token = authService.signToken(req.user._id);
        var view = indexTemplate({
          context: JSON.stringify({
            user: {
                _id: req.user._id,
                email: req.user.email,
                appId: req.user.appId,
                name: req.user.name,
                invited: req.user.invited,
                isAdmin: req.user.isAdmin,
                isSuperAdmin: req.user.isSuperAdmin,
                hasPassword: req.user.hash != null// && req.user.token == null
            },
            token: token
          })
        });
        res.send(view);
      } else {
        res.send(landingTemplate({}));
      }
    });
};
