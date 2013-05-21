console.log("Loading database...");
var levelup = require('levelup')
// 1) Create our database, supply location and options.
//    This will create or open the underlying LevelDB store.
var db = levelup('./app/server/mydb');
console.log("database ready.");


exports.saveDashboard = function(serializedDashboard, user, callback) {
	var dashboardUID = buildDasboardUID(serializedDashboard.id, user.id);
	console.log("saving dashboard "+ dashboardUID + " for user "+ user.username);
	db.put(dashboardUID, serializedDashboard);
};

exports.loadDashboard = function(dashboardId, user, callback) {
	var dashboardUID = buildDasboardUID(dashboardId, user.id);
	console.log("loading dashboard "+ dashboardUID + " for user "+ user.username);

 	db.get(dashboardUID, function (err, value) {
		if (err) {
			console.log('Ooops!', err) // likely the key was not found
		} else {
		 	console.log("dashboard loaded: " + JSON.stringify(value));
		}
	 	callback(value, err);
 	});
};

function buildDasboardUID(dashboardId, userId){
	return userId + "_" + dashboardId;
};

