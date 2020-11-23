var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

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
app.post('/menu', function (req, res) {
    res.render('menu',{
        name_en: array[3],
    });
});
app.get('/main', function (req, res) {
    message = "";
    status = true;
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
app.post('/attachFiles', function (req, res) {
    if(req.body.code == null){
        console.log("null");
    }
    let a = {
        "username": array[1], 
        topic: req.body.Topic, 
        to: req.body.To,
        college_year: req.body.college_year,
        housenum: req.body.HouseNum,
        sub_district: req.body.sub_district,
        district: req.body.district,
        province: req.body.province,
        student_phonenumber: req.body.student_phonenumber,
        relative_phone_number: req.body.relative_phone_number,
        teacher: req.body.teacher,
        semester: req.body.semester,
        era: req.body.era,
        code: req.body.code,
        subject: req.body.subject,
        section: req.body.section,
        reason: req.body.reason,
        date: req.body.date,
        month: req.body.month,
        year: req.body.year,
    };
    database.insert(a);
    res.render('attachFiles', {
        name_en: array[3],
    });
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
app.get('/information2', function (req, res) {
    res.render('information2', {
        tu_status: array[0],
        username: array[1],
        name_th: array[2],
        name_en: array[3],
        email: array[4],
        type: array[5],
        department: array[6],
        organization: array[7],
    });
});
app.get('/getData', function (req, res) {
    let a = {status: status, message: message}
    res.json(a);
})
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

let array = [];
let status = true;
let message = "";

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
            if(j.type == "student"){
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
            }
            else if(j.type == "employee"){
                res.render("menu", {
                    tu_status: j.tu_status,
                    username: j.username,
                    name_th: j.displayname_th,
                    name_en: j.displayname_en,
                    email: j.email,
                    type: j.type,
                    department: j.department,
                    organization: j.organization,
                });
            }
            
        } else {
            status = false;
            message = j.message;
            res.render('login');
        }
    } else {
        status = false;
        message = "";
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
