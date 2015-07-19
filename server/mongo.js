var mongo = require('mongoskin');
var config = require('./config');
var db = {};

db.stage = mongo.db(config.mongo.stage, {native_parser: true});

db.stage.on('error', function (err) {
    console.log('connection Error: ' + err);
});

db.stage.on('connected', function () {
    console.log('connected');
});

db.stage.on('reconnected', function () {
    console.log('reconnected');
});

db.stage.on('disconnected', function () {
    console.log('disconnected');
});

module.exports = {
    Users: db.stage.collection('users'),
    Messages: db.stage.collection('messages')	
};