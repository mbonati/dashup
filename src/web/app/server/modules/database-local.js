console.log("Loading database...");
var levelup = require('levelup')
// 1) Create our database, supply location and options.
//    This will create or open the underlying LevelDB store.
var db = levelup('./app/server/mydb');
console.log("database ready.");


exports.saveDashboard = function(serializedDashboard, user, callback) {
	var dashboardUID = user.id + "_" + serializedDashboard.id;
	console.log("saving dashboard "+ dashboardUID + " for user "+ user.username);

	db.put(dashboardUID, serializedDashboard);

};

