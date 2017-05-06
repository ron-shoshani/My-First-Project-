//Lets require/import the HTTP module
var HttpDispatcher = require('httpdispatcher');
var http           = require('http');
var dispatcher     = new HttpDispatcher();
var fs = require('fs');
var getQueryParam = require('get-query-param');
var path = require('path');
var arrayContains = require('array-contains');
//fs = require('fs')
  //          fs.readFile('json/ron.json', 'utf8', function (err,data) {
  //            if (err) {
  //              return console.log(err);
  //             }
  //             console.log(data);
  //          });

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

function readJson (res,name){
    fs.readFile('json/' + name + '.json', 'utf8', function (err,data) {
        res.writeHead(200, {'Content-Type': 'text/plain','Access-Control-Allow-Origin': '*'});
        res.write(data);
        res.end();
})};

//A sample GET request   
console.log(dispatcher.onGet) 
dispatcher.onGet("/page1", function(req, res) {
    application = getQueryParam('application',req.url);
    if (fs.existsSync('json/' + application + '.json')) {

        readJson(res,application);
   }
    else {
        readJson(res,'all')
    }
});    

//A sample POST request
dispatcher.onPost("/post1", function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain','Access-Control-Allow-Origin': '*'});
    res.end('Got Post Data');
});

//(application == 'ron') || (application == 'liza') || (application == 'meir')
//path = 'json/' + application + '.json';
//if (!fileExists(path))