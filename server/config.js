var path = require('path');
var setty = require('setty');
setty.load({settingsDir: path.join(__dirname, '../settings')});

var useBuildApp = setty.get('useBuildApp');

var rootPath = path.join(__dirname + '/../');
var spaIndex = useBuildApp ? '../client/dist/index.html' : '../client/index.html';
var spaIndexHtmlPath = path.join(__dirname, spaIndex);

module.exports = {
  root: rootPath,
  port: setty.get("port"),
  mongo: setty.get("mongo"),
  secrets: setty.get('secrets'),
  rootUrl: setty.get('rootUrl'),
  useBuildApp: setty.get('useBuildApp'),
  spaIndexHtmlPath: spaIndexHtmlPath
};
