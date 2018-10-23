"use strict";

/* jshint node: true */

/*
 * This builds on the webServer of previous projects in that it exports the current
 * directory via webserver listing on a hard code (see portno below) port. It also
 * establishes a connection to the MongoDB named 'cs142project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch any file accessible
 * to the current user in the current directory or any of its children.
 *
 * This webServer exports the following URLs:
 * /              -  Returns a text status message.  Good for testing web server running.
 * /test          - (Same as /test/info)
 * /test/info     -  Returns the SchemaInfo object from the database (JSON format).  Good
 *                   for testing database connectivity.
 * /test/counts   -  Returns the population counts of the cs142 collections in the database.
 *                   Format is a JSON object with properties being the collection name and
 *                   the values being the counts.
 *
 * The following URLs need to be changed to fetch there reply values from the database.
 * /user/list     -  Returns an array containing all the User objects from the database.
 *                   (JSON format)
 * /user/:id      -  Returns the User object with the _id of id. (JSON format).
 * /photosOfUser/:id' - Returns an array with all the photos of the User (id). Each photo
 *                      should have all the Comments on the Photo (JSON format)
 *
 */

var mongoose = require('mongoose');
var async = require('async');
var fs = require('fs');

var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var processFormBody = multer({
    storage: multer.memoryStorage()
}).single('uploadedphoto');

// salted password
var crypto = require('crypto');

// Load the Mongoose schema for User, Photo, and SchemaInfo
var User = require('./schema/user.js');
var Photo = require('./schema/photo.js');
var SchemaInfo = require('./schema/schemaInfo.js');

var express = require('express');
var app = express();

// XXX - Your submission should work without this line
// var cs142models = require('./modelData/photoApp.js').cs142models;

mongoose.connect('mongodb://localhost/cs142project6');

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.
app.use(express.static(__dirname));
app.use(session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: false
}));
app.use(bodyParser.json());


app.get('/', function (request, response) {
    response.send('Simple web server of files from ' + __dirname);
});

/*
 * Use express to handle argument passing in the URL.  This .get will cause express
 * To accept URLs with /test/<something> and return the something in request.params.p1
 * If implement the get as follows:
 * /test or /test/info - Return the SchemaInfo object of the database in JSON format. This
 *                       is good for testing connectivity with  MongoDB.
 * /test/counts - Return an object with the counts of the different collections in JSON format
 */
app.get('/test/:p1', function (request, response) {
    // Express parses the ":p1" from the URL and returns it in the request.params objects.
    console.log('/test called with param1 = ', request.params.p1);

    var param = request.params.p1 || 'info';

    if (param === 'info') {
        // Fetch the SchemaInfo. There should only one of them. The query of {} will match it.
        SchemaInfo.find({}, function (err, info) {
            if (err) {
                // Query returned an error.  We pass it back to the browser with an Internal Service
                // Error (500) error code.
                console.error('Doing /user/info error:', err);
                response.status(500).send(JSON.stringify(err));
                return;
            }
            if (info.length === 0) {
                // Query didn't return an error but didn't find the SchemaInfo object - This
                // is also an internal error return.
                response.status(500).send('Missing SchemaInfo');
                return;
            }

            // We got the object - return it in JSON format.
            console.log('SchemaInfo', info[0]);
            response.end(JSON.stringify(info[0]));
        });
    } else if (param === 'counts') {
        // In order to return the counts of all the collections we need to do an async
        // call to each collections. That is tricky to do so we use the async package
        // do the work.  We put the collections into array and use async.each to
        // do each .count() query.
        var collections = [{
                name: 'user',
                collection: User
            },
            {
                name: 'photo',
                collection: Photo
            },
            {
                name: 'schemaInfo',
                collection: SchemaInfo
            }
        ];
        async.each(collections, function (col, done_callback) {
            col.collection.count({}, function (err, count) {
                col.count = count;
                done_callback(err);
            });
        }, function (err) {
            if (err) {
                response.status(500).send(JSON.stringify(err));
            } else {
                var obj = {};
                for (var i = 0; i < collections.length; i++) {
                    obj[collections[i].name] = collections[i].count;
                }
                response.end(JSON.stringify(obj));

            }
        });
    } else {
        // If we know understand the parameter we return a (Bad Parameter) (400) status.
        response.status(400).send('Bad param ' + param);
    }
});

// logout
app.get('/admin/logout', function (request, response) {
    request.session.destroy(function (err) {
        if (err) {
            response.status(401).send();
            return;
        } else {
            response.status(200).send();
            return;
        }
    });
});


// login
app.post('/admin/login', function (request, response) {
    var login_name = request.body.login_name;
    var pwd = request.body.password;

    User.findOne({
        'login_name': login_name
    }, function (err, user) {
        if (err !== null) {
            console.log("err");
            response.status(400).send("An Error Occurred");
            return;
        } 
        if (user === null) {
            console.log("invalid user id");
            response.status(400).send("Invalid User ID");
            return;
        } 
        console.log("xxxx " + user.salt);
        // add salt if salt exists
        if (user.salt !== undefined) {
            var saltNum = user.salt;
            var ha= crypto.createHash('sha256');
            ha.update(pwd + saltNum);
            pwd = ha.digest("hex");
        } 
        if (pwd !== user.password) {
            response.status(400).send("Incorrect Password");
        } else {
            request.session.user = user;
            response.status(200).send(user);
        }
    });
});


app.get('/user/list', function (request, response) {
    var info = [];
    User.find({}, function (err, users) {
        if (err !== null) {
            response.status(500).send("ERROR");
        } else {
            for (var i = 0; i < users.length; i++) {
                var user = users[i];
                var obj = {
                    _id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name
                };
                info.push(obj);
            }
        }
        response.status(200).send(info);
    });
});


app.get('/user/:id', function (request, response) {
    var id = request.params.id;
    User.findOne({
        _id: id
    }, function (err, user) {
        if (err !== null) {
            response.status(400).send("ERROR");
        } else {
            var info = JSON.parse(JSON.stringify(user));
            delete info.__v;
            response.status(200).send(info);
        }
    });
});


app.get('/photosOfUser/:id', function (request, response) {
    var id = request.params.id;
    Photo.find({
        'user_id': id
    }, function (err, photos) {
        if (err !== null) {
            response.status(400).send("ERROR");
            // return;
        } else if (photos.length === 0) {
            response.status(400).send("NO SUCH PHOTOS");
            // return;
        } else {
            var functionStack = [];
            var info = JSON.parse(JSON.stringify(photos));
            for (var i = 0; i < info.length; i++) {
                delete info[i].__v;
                var comments = info[i].comments;

                comments.forEach(function (comment) {
                    var uid = comment.user_id;
                    // note here: create a function, push to stack, but not call them
                    // call will be done later with async calls
                    functionStack.push(function (callback) {
                        User.findOne({
                            '_id': uid
                        }, function (err, result) {
                            if (err !== null) {
                                response.status(400).send("ERROR");
                            } else {
                                var userInfo = JSON.parse(JSON.stringify(result));
                                var user = {
                                    _id: uid,
                                    first_name: userInfo.first_name,
                                    last_name: userInfo.last_name
                                };
                                comment.user = user;
                            }
                            callback(); // why is this callback necessary?
                        });
                    });
                    delete comment.user_id;
                });

            }

            async.parallel(functionStack, function (res) {
                response.status(200).send(info);
            });
        }
    });
});


app.post('/commentsOfPhoto/:photo_id', function (request, response) {
    if (request.session === undefined || request.session.id === null) {
        response.status(401).send("User is not logged in.");
    } else {
        var photoid = request.params.photo_id;
        Photo.findOne({
            _id: photoid
        }, function (err, photo) {
            if (err) {
                response.status(401).send("Photo Error");
                return;
            } else if (photo === null) {
                response.status(401).send("Invalid Photo Id");
                return;
            } else if (request.body.comment === undefined || request.body.comment === "") {
                response.status(400).send("Empty Comments");
            } else {
                var temp = photo.comments;
                temp.push({
                    comment: request.body.comment,
                    user_id: request.session.user._id
                });
                photo.set({
                    comments: temp
                });
                photo.save(function (err, info) {
                    if (err) {
                        console.log(JSON.stringify(err));
                    }
                });
                response.status(200).send("Successfully Commented");
                return;
            }
        });
    }
});


app.post('/photos/new', function (request, response) {
    processFormBody(request, response, function (err) {
        if (err || !request.file) {
            response.status(400).send("File Upload Error");
            return;
        }
        var timestamp = new Date().valueOf();
        var filename = 'U' + String(timestamp) + request.file.originalname;

        fs.writeFile("./images/" + filename, request.file.buffer, function (err) {
            if (err !== null) {
                response.status(400).send("File Write Error");
                return;
            }

            Photo.create({
                file_name: filename,
                user_id: request.session.user._id
            }, function (err, photo) {
                if (err !== null) {
                    response.status(400).send("Database Update Error");
                    return;
                }
                photo.id = photo._id;
                photo.save();
                console.log("Photo created with _id: ", photo._id);
                response.status(200).send(photo);
            });
        });
    });
});


app.post('/user', function (request, response) {


    // if input is never filled, it is undefined
    // if input is filled then deleted, it is empty string
    if (request.body.login_name === undefined || request.body.login_name === "") {
        response.status(400).send("login_name undefined");
        return;
    }
    if (request.body.password === undefined || request.body.login_name === "") {
        response.status(400).send("password undefined");
        return;
    }
    if (request.body.first_name === undefined || request.body.first_name === "") {
        response.status(400).send("first_name undefined");
        return;
    }
    if (request.body.last_name === undefined || request.body.last_name === "") {
        response.status(400).send("last_name undefined");
        return;
    }
    User.findOne({
        login_name: request.body.login_name
    }, function (err, user) {
        if (err) {
            response.status(400).send("Database Error");
            return;
        }
        if (user) {
            response.status(400).send("login_name exists");
            return;
        }
        // generate salt
        var saltNum = crypto.randomBytes(256).toString('hex');
        // update digest
        var has = crypto.createHash('sha256');
        has.update(request.body.password + saltNum);
        User.create({
            login_name: request.body.login_name,
            // password: request.body.password,
            password: has.digest('hex'),
            first_name: request.body.first_name,
            last_name: request.body.last_name,
            location: request.body.location,
            occupation: request.body.occupation,
            description: request.body.description,
            salt: saltNum
        }, function (err, user) {
            if (err) {
                response.status(400).send("User create error");
                return;
            }
            user.id = user._id;
            user.save();
            request.session.user = user;
            console.log("User created with id: ", user.id);
            response.status(200).send(user);
        });

    });
    


});


var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});