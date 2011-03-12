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
app.get(/getDoc.*/, function(req, res) {
    var doc_id = req.query.doc_id,
        bucket = req.query.bucket;
    if (!doc_id) {
        res.send({success: false, message: 'No document id.'});
    } else {
        db.get(bucket, doc_id, function(err, doc, meta) {
            res.send({data: doc, meta: meta});
        });
    }
});
app.get(/getBucket.*/, function(req, res) {
    var bucket = req.query.bucket || '',
        start = (req.query.start?parseInt(req.query.start):0),
        size = (req.query.size?parseInt(req.query.size):0),
        fields = (req.query.fields?req.query.fields.split(','):[]);
    db.getAll(bucket, function(err, rows) {
        res.send(
            {
                rows: ((fields.length > 0)?rows.map(function(row) {
                    var data = row.data;
                    return {meta: row.meta, data: filterProperties(row.data, fields)};
                }):rows)
            }
        );
    });
});
app.get(/.*/, function(req, res) {
    res.render('main', {});
});

var filterProperties = function(o, fields) {
    var new_obj = {};
    Object.keys(o).forEach(function(property) {
        if (fields.indexOf(property) >= 0) {
            new_obj[property] = o[property];
        }
    });
    return new_obj;
}

app.listen(5000);

console.log('Blinds have been opened.');
