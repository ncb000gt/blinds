$(document).ready(function() {
    var bucket_name,
        current_doc,
        _bucket = {};
    function setDocData(data) {
        var doc = $("#doc");
        doc.val(JSON.stringify(data));
        doc.attr({disabled:false});
    }
    function docDetails() {
        var id = $(this).attr('id');
        $.get('/getDoc',
            {bucket: bucket_name, doc_id: id},
            function(data) {
                current_doc = data;
                setDocData(data);
            },
            'json');
    }
    function showBucket(fields, bucket) {
        var thead = $('.content thead');
        thead.empty();
        var head_tr = $('<tr><th>Key</th></tr>');
        for (var i = 0; i < fields.length; i++) {
            head_tr.append('<th>'+fields[i]+'</th>');
        }
        thead.append(head_tr);
        var tbody = $('.content tbody');
        tbody.empty();
        $.each(Object.keys(bucket), function(idx, rowKey) {
            var row = bucket[rowKey];
            var tr = $('<tr id="'+row.meta.key+'" style="cursor: pointer;"><td>'+row.meta.key+'</td></tr>');
            $.each(fields, function(idx2, field) {
                var content = row.data[field];
                if (content.length > 300) {
                    content = content.substring(0, 300) + '...';
                }
                tr.append('<td>'+content+'</td>');
            });
            tr.click(docDetails);
            tbody.append(tr);
        });
    }
    function resetDetails() {
        var doc = $('#doc');
        doc.val('');
        doc.attr({disabled:true});
        $('.doc button').attr({disabled:true});
    }
    $('#reset').click(function() {
        setDocData(current_doc);
    });
    $('#save').click(function(e) {
        e.preventDefault();
        var doc = $('#doc');
        if (doc.val()) {
            $.post('/saveDoc?bucket='+$('.options #bucket').val(),
            {doc: doc.val()},
            function(data) {
                console.log('data: ' + data);
            },
            'json');
        }
    });
    $('#doc').keydown(function() {
        $('.doc button').attr({disabled:false});
    });
    $('.options form').submit(function(e) {
        e.preventDefault();
        var fields = $('#fields').val();
        bucket_name = $('.options #bucket').val();
        var params = {bucket: bucket_name};
        if (fields) {
            params.fields = fields;
        }
        $.get('/getBucket',
            params,
            function(data) {
                _bucket = {};
                $.each(data.rows, function(idx, row) {
                    _bucket[row.meta.key] = row;
                });
                resetDetails();
                showBucket((fields?fields.split(','):[]), _bucket);
            },
            'json');
    });
});
