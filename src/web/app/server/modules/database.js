console.log("Loading database...");

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

	var dashboardUID = user.id + "_" + serializedDashboard.id;
	console.log("saving dashboard "+ dashboardUID + " for user "+ user.username);

	dashboards.find({'userId':user.id, "dashboardId": serializedDashboard.id }).nextObject(function(err, doc) {            
          console.log("Returned #1 documents");
    });

	/*
	var dashboardInfo = { "userId": user.id, 
						  "dashboardId": serializedDashboard.id,
						  "dashboard": serializedDashboard };
	dashboards.insert(dashboardInfo, {safe: true}, function(err, records) {
 		if (err) throw err;
 		console.log("Record added as "+records[0]._id);
 	});
	*/

};