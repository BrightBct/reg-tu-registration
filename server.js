'use strict';
var express = require('express');
var path = require('path');
var https = require('https');
var http = require('http');

var PORT  = process.env.PORT || 5000;

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('index', {fname: 'Songsakdi', lName: 'Rongviri'});
});

app.listen(PORT, function () {
    console.log(`Listening on ${PORT}`)
});

app.get('/api', function (req, res) {
    const queryParams = req.query;
    console.log('param[1]:' + queryParams['user']);
    res.send(queryParams);
});





//var options = {
//    'method': 'POST',
//    'hostname': 'restapi.tu.ac.th',
//    'path': '/api/v1/auth/Ad/verify',
//    'headers': {
//        'Content-Type': 'application/json',
//        'Application-Key': 'TUa4e553b83aa271d3411a4ad88395265801fcfb074110e8b0e03962c01f2aed6ab1662db3a0e1451df7835880c6828fcf'
//    }
//};

//var req = https.request(options, function (res) {
//    var chunks = [];

//    res.on("data", function (chunk) {
//        chunks.push(chunk);
//    });

//    res.on("end", function (chunk) {
//        var body = Buffer.concat(chunks);
//        console.log(body.toString());
//    });

//    res.on("error", function (error) {
//        console.error(error);
//    });
//});


//var options = {
//    'method': 'GET',
//    'hostname': 'restapi.tu.ac.th',
//    'path': '/api/v2/std/fac/all',
//    'headers': {
//        'Content-Type': 'application/json',
//        'Application-Key': 'TUa4e553b83aa271d3411a4ad88395265801fcfb074110e8b0e03962c01f2aed6ab1662db3a0e1451df7835880c6828fcf'
//    }
//};

//var req = https.request(options, function (res) {
//    var chunks = [];

//    res.on("data", function (chunk) {
//        chunks.push(chunk);
//    });

//    res.on("end", function (chunk) {
//        var body = Buffer.concat(chunks);
//        console.log(body.toString());
//    });

//    res.on("error", function (error) {
//        console.error(error);
//    });
//});

//req.end();


const options = {
    hostname: 'jsonplaceholder.typicode.com',
    path: '/posts/1/comments',
    method: 'GET',
    'headers': {
        'Content-Type': 'application/json',
    }
};

function dataCounter(inputs) {
    let counter = 0;
    for (const input of inputs) {
        if (input.postId === 1) counter += 1;
    }
    return counter;
};

const req = http.request(options, function(response) {
    response.setEncoding('utf8');
    response.on('data', chunk => {
        console.log('number of posts:' + dataCounter(chunk));
    });

    response.on('end', () => {
        console.log('end of GET request');
    });
});

req.on('error', e => {
    console.log('Problem with request:', e.message);
});
req.end();