var express = require('express');
var formidable = require('formidable');
const path = require("path");
const fs = require('fs');
var app = express();
const request = require('request');
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.post('/', function (req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req);

    form.on('fileBegin', function (name, file) {
        file.path = __dirname + '/uploads/' + file.name;
    });

    form.on('file', function (name, file) {
        console.log('Uploaded ' + file.name);
    });

    res.sendFile(__dirname + '/index.html');
});

app.post('/postfile', function (req, res) {
    var form = new formidable.IncomingForm();
    // form.maxFileSize = 3 * 1024 * 1024; // 3mb
    form.maxFileSize = 1 * 1024;
    try {
        form.parse(req);

        form.on('fileBegin', function (name, file) {
            // file.path = __dirname + '/uploads/' + file.name;
        });

        form.on('file', function (name, file) {
            console.log('Uploaded ' + JSON.stringify(file));
            // var filename = "file-" + Date.now() + file.filename;
            if (file.size > form.maxFileSize) {
                return
            } else {
                var filename = "file-" + Date.now() + path.extname(file.name);
                var content = fs.readFileSync(file.path);
                options = {
                    method: "POST",
                    url: 'https://content.dropboxapi.com/2/files/upload',
                    headers: {
                        "Content-Type": "application/octet-stream",
                        "Authorization": "Bearer " + 'o8W7YIJIh4UAAAAAAAABmflbEecsmne3uxWdtiMIZGqCWOymxfcd7Lfa7rmf2wJC',
                        "Dropbox-API-Arg": "{\"path\": \"/dropbox/" + filename + "\",\"mode\": \"overwrite\",\"autorename\": true,\"mute\": false}",
                    },
                    body: content
                }
                request(options, (err, res, body) => {
                    console.log('Upload Error', err);
                });
            }
           
        });
        form.on('field', function(name, field) {
            console.log('Got a field:', name, field);
        })

        form.parse(req, (err, fields, files) => {
            if (err) {
                console.error('Error', err)
                res.status(401).json({
                    error: 'errorWhenUploadFiles'
                });
            } else {
                res.json({
                    data: 'OK'
                });
            }
        })

    } catch (error) {
        console.log('Call Errorrr', error)
        res.status(402).json({
            error: error
        });
    }


});

app.listen(3000);