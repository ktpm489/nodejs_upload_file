var express = require('express');
var formidable = require('formidable');

var app = express();

app.get('/', function (req, res){
    res.sendFile(__dirname + '/index.html');
});

app.post('/', function (req, res){
    var form = new formidable.IncomingForm();

    form.parse(req);

    form.on('fileBegin', function (name, file){
        file.path = __dirname + '/uploads/' + file.name;
    });

    form.on('file', function (name, file){
        console.log('Uploaded ' + file.name);
    });

    res.sendFile(__dirname + '/index.html');
});

app.post('/postfile', function (req, res){
    var form = new formidable.IncomingForm();

    form.parse(req);

    form.on('fileBegin', function (name, file){
        // file.path = __dirname + '/uploads/' + file.name;
    });

    form.on('file', function (name, file){
        console.log('Uploaded ' + JSON.stringify(file));
    });

    form.parse(req, (err, fields, files) => {
        if (err) {
          console.error('Error', err)
          throw err
        }
        // console.log('Fields', fields)
        // console.log('Files', files)
        // files.upload(file => {
        //   console.log(file)
        // })
      })
    res.json({
        data: 'OK'
    });
});

app.listen(3000);