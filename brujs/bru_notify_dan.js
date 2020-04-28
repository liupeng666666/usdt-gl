var au_id = '';
jQuery(document).ready(function (a) {
    add_update();
});

function tiaoban() {
    load(index_url_y);
}

function add_update() {
    if (block_node != null) {
        $("#bn_title").val(block_node.title);
        $("#bn_content").val(block_node.content);
        au_id = block_node.pid;
        $("#qd").attr("onclick", "qd_update()");
        block_node = null;
    }
}

function qd_add() {
    var title = $("#bn_title").val();
    var content = $("#bn_content").val();
    console.info(content);
    if (title == null) {
        public_tishi("标题不能为空");
        return false;
    }
    if (content == null) {
        public_tishi("介绍内容不能为空");
        return false;
    }

    $.ajax({
        type: "post",
        url: "../usdt/brunotify/addNotify",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            title: title,
            content: content
        },
        success: function (info) {
            if (info.code == 100) {
                tiaoban();
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}

function qd_update() {
    var title = $("#bn_title").val();
    var content = $("#bn_content").val();
    if (title == null) {
        public_tishi("标题不能为空");
        return false;
    }
    if (content == null) {
        public_tishi("介绍内容不能为空");
        return false;
    }
    $.ajax({
        type: "post",
        url: "../usdt/brunotify/changeNotify",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {pid: au_id, title: title, content: content},
        success: function (info) {
            if (info.code == 100) {
                tiaoban();
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}