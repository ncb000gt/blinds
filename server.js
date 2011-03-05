var express = require('express'),
    fs = require('fs'),
    util = require('util'),
    riak = require('riak-js'),
    db = riak.getClient();

var LOG_PATH = '/var/log/blinds.log',
logStream = fs.createWriteStream(LOG_PATH);

var app = express.createServer();
app.configure(function() {
    app.set('view engine', 'jade');
    app.set('views', __dirname + '/views');
    app.use(express.logger({buffer: true, stream: logStream}));
    app.use(express.static(__dirname + '/public'));
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.session({secret: 'blinds riak client interface'}));    
});

app.post(/saveDoc/, function(req, res) {
    var bucket = req.query.bucket || '';
    var bdoc = JSON.parse(req.body.doc),
        meta = bdoc.meta,
        doc = bdoc.data;
    db.save(bucket, meta.key, doc, meta, function(err) {
        res.send({err: err, success: !(err)});
    });
});
app.get(/getBucket.*/, function(req, res) {
    var bucket = req.query.bucket || '';
    db.getAll(bucket, function(err, rows) {
        res.send({rows: rows});
    });
});
app.get(/.*/, function(req, res) {
    res.render('main', {});
});

app.listen(3000);
