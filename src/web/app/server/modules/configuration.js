console.log("Loading configuration...");
var fs    = require('fs'),
      nconf = require('nconf');
nconf.argv()
  .env()
  .file({ file: './dashup.config.json' });


exports.configuration = nconf;

console.log("Configuration loaded");
