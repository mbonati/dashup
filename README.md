![Alt text](docs/dashup_logo_small_1.0.0.png "Login")


Html5 dashboard with REST API for Application Telemetry.


#### Software Stack ####

##### Server side: #####
* node.js (http://nodejs.org/) 
* Express (http://expressjs.com/) : used as middleware for web client and REST interface
* socket.io (http://socket.io/) : used for realtime data push
* mongoDB (http://docs.mongodb.org/) : used for persistence
* nconf (https://github.com/flatiron/nconf) : used for application configurations
* jade (http://jade-lang.com/) 
* stylus (http://learnboost.github.io/stylus/)
* moment (http://momentjs.com/)
* https://github.com/rvagg/node-levelup


#### Getting started ####

##### MongoDB prerequisite #####

* install mongodb (http://www.mongodb.org/)
* create a db directory into the mongodb installation folder (ex: mkdir -p data/db)
* start mondodb service with the command "mongod dbpath data/db" (or any other db folder created above)

##### Web Application #####

* install node.js (http://nodejs.org/) 
* checkout or download the project
* go to the src/web folder and type "npm install -d"
* start the application with the command "node app"
* start the browser at url "http://localhost:3000"
* Login credentials: user=admin , password=* 

##### Java JMX Proxy #####
* todo


#### Screenshots ####



![Alt text](docs/screenshots/login.png "Login")	
![Alt text](docs/screenshots/screen1.png "Screenshot")

