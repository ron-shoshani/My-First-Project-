//Lets require/import the HTTP module
var HttpDispatcher = require('httpdispatcher');
var http           = require('http');
var dispatcher     = new HttpDispatcher();
var fs = require('fs');
var getQueryParam = require('get-query-param');
var path = require('path');
var arrayContains = require('array-contains');
var express = require('express');
var app = express();

// prepare server
//app.use('/api', api); // redirect API calls
app.use('/', express.static(__dirname + '/www')); // redirect root
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

//Lets define a port we want to listen to
const PORT=8080; 

//We need a function which handles requests and send response
function handleRequest(request, response){
    try {
        //log the request on console
        console.log(request.url);
        
        //console.log(application);
        //Disptach
        dispatcher.dispatch(request, response);
    } catch(err) {
        console.log(err);
    }
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});

dispatcher.setStatic('/resources');

function readJson (res,name) {
    fs.readFile('json/' + name + '.json', 'utf8', function (err,data) {
        res.writeHead(200, {'Content-Type': 'text/plain','Access-Control-Allow-Origin': '*'});
        res.write(data);
        res.end();
})};

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

//A sample GET request   
console.log(dispatcher.onGet) 
dispatcher.onGet("/page1", function(req, res) {
    //application = getQueryParam('application',decodeURI(req.url));
    application = getParameterByName('application',req.url);
    console.log(application);
    console.log('ron');
    if (fs.existsSync('json/' + application + '.json')) {

        readJson(res,application);
   }
    else {
        readJson(res,'all')
    }
});    

//A sample POST request
dispatcher.onPost("/post1", function(req, res) {
  var params = req.params;
  var jsonfile = require('jsonfile');
  var file = 'json/' + params.name + '.json';
  if ((params.name=="") || (params.address=="") || (params.phone=="")){
    res.writeHead(200, {'Content-Type': 'text/plain','Access-Control-Allow-Origin': '*'});
    res.end('Data is missing in empolyee card!!!');
  }
  else if (fs.existsSync(file)) {
    res.writeHead(200, {'Content-Type': 'text/plain','Access-Control-Allow-Origin': '*'});
    res.end('Employee card already exist!!!');
  }
  else {
    res.writeHead(200, {'Content-Type': 'text/plain','Access-Control-Allow-Origin': '*'});
    res.end('Employee card successfuly created!!!');
    var obj = {name: params.name,address:params.address,phone:params.phone,Information:params.information};
    jsonfile.writeFileSync(file, obj);
  }
  });


//http-server
