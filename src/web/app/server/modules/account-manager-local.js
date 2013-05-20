var jsonUsersDb  = "../users.json";


exports.autoLogin = function(user, pass, callback)
{
  findByUsername(user, function(e,o){
    if (o){
      o.password == pass ? callback(o) : callback(null);
    } else {
      callback(null);
    }
  });
}


exports.manualLogin = function(user, pass, callback)
{
  findByUsername(user, function(e,o){
    if (o){
      o.password == pass ? callback(null, o) : callback(null);
    } else {
      callback(null);
    }
  });
}

exports.addNewAccount = function(newData, callback)
{
  //TODO!!
}

exports.updateAccount = function(newData, callback)
{
  //TODO!!
}

exports.updatePassword = function(email, newPass, callback)
{
  //TODO!!
}

exports.getAccountByEmail = function(email, callback)
{
  //TODO!!
}

exports.validateResetLink = function(email, passHash, callback)
{
  //TODO!!
}

exports.getAllRecords = function(callback)
{
  //TODO!!
};

exports.delAllRecords = function(callback)
{
  //TODO!!
}


/** >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Users DB **/
function findById(id, fn) {
  console.log("findById called for "+ id);
  var usersDb  = require(jsonUsersDb);
  var idx = id - 1;
  if (usersDb[idx]) {
    fn(null, usersDb[idx]);
  } else {
    fn(new Error('User ' + id + ' does not exist'));
  }
}

function findByUsername(username, fn) {
  console.log("findByUsername called for "+ username);
  var usersDb  = require(jsonUsersDb);
  for (var i = 0, len = usersDb.length; i < len; i++) {
    var user = usersDb[i];
    if (user.username === username) {
      console.log("user found for "+ username);
      return fn(null, user);
    }
  }
  return fn(null, null);
}

/** <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< END Users DB **/

