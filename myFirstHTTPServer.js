//"use strict";
//Lets require/import the HTTP module
var fs = require('fs');
var getQueryParam = require('get-query-param');
var path = require('path');
var arrayContains = require('array-contains');
var express = require('express');
var app = express();
var fileUpload = require('express-fileupload');

// prepare server
//app.use('/api', api); // redirect API calls
//app.use('/', express.static(__dirname + '/www')); // redirect root
app.use(express.static('public'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js/bootstrap.min.js')); // redirect bootstrap JS
app.use('/jq', express.static(__dirname + '/node_modules/jquery/dist/jquery.min.js')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css/bootstrap.min.css')); // redirect CSS bootstrap


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
app.get("/page1", function(req, res) {
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
app.post("/post1", function(req, res) {
  var params = req.query;
  console.log(params);
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

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')});
