console.log("Loading database...");

var DASHUP 		= require('./dashup-utils');
var crypto 		= require('crypto')
var MongoDB 	= require('mongodb').Db;
var Server 		= require('mongodb').Server;
var moment 		= require('moment');
var configuration = require("./configuration").configuration;


var dbPort 		= configuration.get("database:port");// 27017;
var dbHost 		= configuration.get("database:host");// 'localhost';
var dbName 		= configuration.get("database:name");// 'node-login';

console.log("Opening database "+ dbName + "@"+ dbHost +":" + dbPort);

/* establish the database connection */

var db = new MongoDB(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}), {w: 1});
	db.open(function(e, d){
	if (e) {
		console.log(e);
	}	else{
		console.log('connected to database :: ' + dbName);
	}
});
var accounts = db.collection('accounts');
var dashboards = db.collection('dashboards');


exports.saveDashboard = function(serializedDashboard, user, callback) {

	var dashboardUID = DASHUP.buildDasboardUID(serializedDashboard.dashboardId, user.id);

	console.log("saving dashboard "+ dashboardUID + " for user "+ user.username + " -> " + JSON.stringify(serializedDashboard));

	var dashboardInfo = { "_id": dashboardUID,
						  "userId": user.id, 
						  "dashboardId": serializedDashboard.dashboardId,
						  "dashboard": serializedDashboard };

	dashboards.save(dashboardInfo, {safe: true}, function(err, records) {
 		if (err) throw err;
 		console.log("Record added as "+records);
 	});
	

};

exports.loadDashboard = function(dashboardId, user, callback) {

	var dashboardUID = DASHUP.buildDasboardUID(dashboardId, user.id);

	console.log("loading dashboard "+ dashboardUID + " for user "+ user.username);

	dashboards.find({'userId':user.id, "dashboardId": dashboardId }).nextObject(function(err, doc) {            
          console.log("Returned #1 documents " + JSON.stringify(doc));
          callback(doc);
    });

};


