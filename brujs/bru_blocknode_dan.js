var au_id = '';
jQuery(document).ready(function (a) {
    file_input_trigger();
    add_update();
});

function file_input_trigger() {
    $("#file-add").fileinput({
        showCaption: false,
        browseClass: "btn btn-ls",
        fileType: "any",
        showUpload: false
    })
};

function tiaoban() {
    load(index_url_y);
}

function add_update() {
    if (block_node != null) {
        console.log(block_node)
        $("#bn_name").val(block_node.name);
        $("#bn_title").val(block_node.title);
        $("#bn_price").val(block_node.price);
        $("#bn_alive").val(block_node.alive);
        $("#bn_daybru").val(block_node.daybru);
        $("#bn_period").val(block_node.period);
        $("#bn_onealive").val(block_node.onealive);
        $("#bn_onebru").val(block_node.onebru);
        $("#bn_twoalive").val(block_node.twoalive);
        $("#bn_twobru").val(block_node.twobru);
        $("#bn_threealive").val(block_node.threealive);
        $("#bn_threebru").val(block_node.threebru);
        $("#bn_img").attr("src", block_node.img);
        $("#bn_content").val(block_node.content);
        au_id = block_node.id;
        $("#update_img").show();
        $("#qd").attr("onclick", "qd_update()");
        block_node = null;
    }
}

function qd_add() {
    var name = $("#bn_name").val();
    var title = $("#bn_title").val();
    var price = $("#bn_price").val();
    var alive = $("#bn_alive").val();
    var daybru = $("#bn_daybru").val();
    var period = $("#bn_period").val();
    var onealive = $("#bn_onealive").val();
    var onebru = $("#bn_onebru").val();
    var twoalive = $("#bn_twoalive").val();
    var twobru = $("#bn_twobru").val();
    var threealive = $("#bn_threealive").val();
    var threebru = $("#bn_threebru").val();
    var img = document.getElementById("file-add").files[0];
    var content = $("#bn_content").val();

    if (name == null) {
        public_tishi("名称不能为空");
        return false;
    }
    if (title == null) {
        public_tishi("标题不能为空");
        return false;
    }
    if (price == null) {
        public_tishi("价格不能为空");
        return false;
    }
    if (alive == null) {
        public_tishi("赠送活跃度不能为空");
        return false;
    }
    if (daybru == null) {
        public_tishi("日生产BRU不能为空");
        return false;
    }
    if (period == null) {
        public_tishi("期限不能为空");
        return false;
    }
    if (onealive == null) {
        public_tishi("第一代成员获赠活跃度不能为空");
        return false;
    }
    if (onebru == null) {
        public_tishi("第一代成员获赠BRU不能为空");
        return false;
    }
    if (twoalive == null) {
        public_tishi("第二代成员获赠活跃度不能为空");
        return false;
    }
    if (twobru == null) {
        public_tishi("第二代成员获赠BRU不能为空");
        return false;
    }
    if (threealive == null) {
        public_tishi("第三代成员获赠活跃度不能为空");
        return false;
    }
    if (threebru == null) {
        public_tishi("第三代成员获赠BRU不能为空");
        return false;
    }
    if (img == null) {
        public_tishi("介绍图片不能为空");
        return false;
    }
    if (content == null) {
        public_tishi("介绍内容不能为空");
        return false;
    }
    var formdata = new FormData();
    formdata.append("name", name);
    formdata.append("title", title);
    formdata.append("price", price);
    formdata.append("alive", alive);
    formdata.append("daybru", daybru);
    formdata.append("period", period);
    formdata.append("onealive", onealive);
    formdata.append("onebru", onebru);
    formdata.append("twoalive", twoalive);
    formdata.append("twobru", twobru);
    formdata.append("threealive", threealive);
    formdata.append("threebru", threebru);
    formdata.append("img", img);
    formdata.append("content", content);
    $.ajax({
        type: "post",
        url: "../usdt/blocknode/addBlockNode",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: formdata,
        enctype: "multipart/form-data",
        processData: false,
        contentType: false,
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
    var name = $("#bn_name").val();
    var title = $("#bn_title").val();
    var price = $("#bn_price").val();
    var alive = $("#bn_alive").val();
    var daybru = $("#bn_daybru").val();
    var period = $("#bn_period").val();
    var onealive = $("#bn_onealive").val();
    var onebru = $("#bn_onebru").val();
    var twoalive = $("#bn_twoalive").val();
    var twobru = $("#bn_twobru").val();
    var threealive = $("#bn_threealive").val();
    var threebru = $("#bn_threebru").val();
    var img = document.getElementById("file-add").files[0];
    var content = $("#bn_content").val();

    if (name == null) {
        public_tishi("名称不能为空");
        return false;
    }
    if (title == null) {
        public_tishi("标题不能为空");
        return false;
    }
    if (price == null) {
        public_tishi("价格不能为空");
        return false;
    }
    if (alive == null) {
        public_tishi("赠送活跃度不能为空");
        return false;
    }
    if (daybru == null) {
        public_tishi("日生产BRU不能为空");
        return false;
    }
    if (period == null) {
        public_tishi("期限不能为空");
        return false;
    }
    if (onealive == null) {
        public_tishi("第一代成员获赠活跃度不能为空");
        return false;
    }
    if (onebru == null) {
        public_tishi("第一代成员获赠BRU不能为空");
        return false;
    }
    if (twoalive == null) {
        public_tishi("第二代成员获赠活跃度不能为空");
        return false;
    }
    if (twobru == null) {
        public_tishi("第二代成员获赠BRU不能为空");
        return false;
    }
    if (threealive == null) {
        public_tishi("第三代成员获赠活跃度不能为空");
        return false;
    }
    if (threebru == null) {
        public_tishi("第三代成员获赠BRU不能为空");
        return false;
    }
    if (content == null) {
        public_tishi("介绍内容不能为空");
        return false;
    }
    var formdata = new FormData();
    formdata.append("name", name);
    formdata.append("title", title);
    formdata.append("price", price);
    formdata.append("alive", alive);
    formdata.append("daybru", daybru);
    formdata.append("period", period);
    formdata.append("onealive", onealive);
    formdata.append("onebru", onebru);
    formdata.append("twoalive", twoalive);
    formdata.append("twobru", twobru);
    formdata.append("threealive", threealive);
    formdata.append("threebru", threebru);
    formdata.append("img", img);
    formdata.append("content", content);
    formdata.append("id", au_id);
    $.ajax({
        type: "post",
        url: "../usdt/blocknode/changeBlockNode",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: formdata,
        enctype: "multipart/form-data",
        processData: false,
        contentType: false,
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