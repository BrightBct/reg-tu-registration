'use strict';
var express = require('express');
var path = require('path');
var https = require('https');
var http = require('http');
var PORT = process.env.PORT || 5000;
var app = express();
var bodyParser = require("body-parser");

const Datastore = require('nedb');
const { response } = require('express');
const database = new Datastore('database.db');
database.loadDatabase();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('login');
});
app.listen(PORT, function () {
    console.log(`Listening on ${PORT}`)
});
app.get('/info', function(req, res){
    database.find({'username': array[1]}, (err, data) =>{
        if(err){
            res.end();
            return;
        }
        res.json(data);
    })
});
app.get('/menu', function (req, res) {
    res.render('menu',{
        name_en: array[3],
    });
});
app.get('/main', function (req, res) {
    res.render('login')
});
app.get('/request', function (req, res) {
    res.render('request',{
        name_en: array[3],
    })
});
app.get('/form', function (req, res) {
    res.render('form', {
        name_en: array[3],
        username: array[1]
    })
});
app.get('/form2', function (req, res) {
    getData();
    let a;
    async function getData(){
        const response = await fetch('/form');
        const data = await response.json();
        a = JSON.parse(JSON.stringify(data));
        database.insert(a);
    }
    res.render('form2', {
        name: a
    })
});
app.get('/information', function (req, res) {
    res.render('information', {
            tu_status: array[0],
            username: array[1],
            name_th: array[2],
            name_en: array[3],
            email: array[4],
            type: array[5],
            department: array[6],
            faculty: array[7],
    });
});
var options = {
  'method': 'POST',
  'hostname': 'restapi.tu.ac.th',
  'path': '/api/v1/auth/Ad/verify',
  'headers': {
  'Content-Type': 'application/json',
  'Application-Key': 'TUc87b2f52e8fdf89c86c4e95e258fb037659e89699792a89e7a76e93cce04154f1dfde358789746a7504b1ecc1ea2b466'
  }
};

var req = https.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function (chunk) {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });
  res.on("error", function (error) {
    console.error(error);
  });
});

let test = "bright";
let array = [];

app.post("/api", async (req, res) => {
    var temp = await getlogin(req.body.user, req.body.pwd);
    console.log("temp = " + temp);
    if (temp) {
        let j = JSON.parse(temp);

        console.log(j);
        if (j.status == true) {
                array[0] = j.tu_status;
                array[1] = j.username;
                array[2] = j.displayname_th;
                array[3] = j.displayname_en;
                array[4] = j.email;
                array[5] = j.type;
                array[6] = j.department;
                array[7] = j.faculty;
                database.count({"username": j.username }, function (err, count) {
                    if(count == 0){
                        database.insert(j);
                    }
                });
            res.render("menu", {
                tu_status: j.tu_status,
                username: j.username,
                name_th: j.displayname_th,
                name_en: j.displayname_en,
                email: j.email,
                type: j.type,
                department: j.department,
                faculty: j.faculty,
            });
        } else {
            res.render('login');
        }
    } else {
        res.render('login');
    }
});

const getlogin = (userName, password) => {
    return new Promise((resolve, reject) => {

        var req = https.request(options, (res) => {
            var chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function (chunk) {
                var body = Buffer.concat(chunks);
                //result = body;
                resolve(body.toString());
                //result = chunks;
            });

            res.on("error", function (error) {
                console.error(error);
                reject(error);
            });
        });

        var postData = "{\n\t\"UserName\":\"" + userName + "\",\n\t\"PassWord\":\"" + password + "\"\n}";
        req.write(postData);
        req.end();
    });
};

