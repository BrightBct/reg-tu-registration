'use strict';
var express = require('express');
var path = require('path');
var https = require('https');
var http = require('http');
var PORT = process.env.PORT || 5000;
var app = express();
var bodyParser = require("body-parser");
var ssd = "Hello"; 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('login', { fname: 'Rungsipon', lName: 'Kasemchotthanapat' });
});
app.listen(PORT, function () {
    console.log(`Listening on ${PORT}`)
});
app.get('/menu', function (req, res) {
    res.render('menu')
});
app.get('/main', function (req, res) {
    res.render('login')
});
app.get('/request', function (req, res) {
    res.render('request')
});
app.get('/form', function (req, res) {
    res.render('form')
});
app.get('/nextform', function (req, res) {
    res.render('form2')
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


// function dataCounter(inputs) {
//     let counter = 0;
//     for (const input of inputs) {
//         if (input.postId === 1) {
//             counter += 1;
//             console.log('input.postId:' + input.postId);
//             console.log('input.email:' + input.email);
//         }
//     }
//     return counter;
// };

app.post("/api", async (req, res) => {
    //const queryParams = req.query;
    //let result = "";
    //console.log(queryParams);
    console.log(req.body);
    const temp = await getlogin(req.body.user, req.body.pwd);
    console.log("temp = " + temp);
    if (temp) {
        let j = JSON.parse(temp);
        console.log(j);
        if (j.status == true) {
            res.render("menu");
            //res.send(temp);
            //res.send("Name th: " + j.displayname_th);
        } else {
            res.render('login');
        }
    } else {
        res.render('login');
    }
    //console.log(result);
    //res.send(JSON.stringify(temp));
    //} else {
    // res.send("login fail");
    // }
});

const getlogin = (userName, password) => {
    return new Promise((resolve, reject) => {
        var options = {
            'method': 'POST',
            'hostname': 'restapi.tu.ac.th',
            'path': '/api/v1/auth/Ad/verify',
            'headers': {
            'Content-Type': 'application/json',
            'Application-Key': 'TUb8d69cb28a011a31bd2e70bb55a3e72d595f706ad580ebc2f898260fec311d3780776cbba92e0b32b90197c98a7e11b3'
            }
        };

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

app.get("/menu/:id", async function(req, res){ 
    var nameid = req.params.id;
    console.log(nameid);
    const data = await getStudentInfo(nameid);
    console.log(data);
    if (data) {
      let j = JSON.parse(data);
      res.render("menu", 
      {prefix: j.data.prefixname,
       name_th: j.data.displayname_th,
       name_en: j.data.displayname_en,
       email: j.data.email,
       faculty: j.data.faculty,
       department: j.data.department
       });
    }
  });


