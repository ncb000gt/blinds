$(document).ready(function() {
    var _bucket = {};
    function docDetails() {
        var id = $(this).attr('id');
        var doc = $("#doc");
        doc.val(JSON.stringify(_bucket[id]));
        doc.attr({disabled:false});
    }
    function showBucket(bucket) {
        var tbody = $('.content tbody');
        tbody.empty();
        $.each(Object.keys(bucket), function(idx, rowKey) {
            var row = bucket[rowKey];
            var tr = $('<tr id="'+row.meta.key+'" style="cursor: pointer;"><td>'+row.meta.key+'</td><td>'+row.meta.vclock+'</td></tr>');
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
    $('.doc button').click(function(e) {
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
    $('#doc').keypress(function() {
        $('.doc button').attr({disabled:false});
    });
    $('.options form').submit(function(e) {
        e.preventDefault();
        $.get('/getBucket',
            {bucket: $('.options #bucket').val()},
            function(data) {
                _bucket = {};
                $.each(data.rows, function(idx, row) {
                    _bucket[row.meta.key] = row;
                });
                resetDetails();
                showBucket(_bucket);
            },
            'json');
    });
});
