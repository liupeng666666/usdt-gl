jQuery(document).ready(function (a) {
    file_input_trigger();
});

function file_input_trigger() {
    $("#file-add").fileinput({
        showCaption: false,
        browseClass: "btn btn-ls",
        fileType: "any",
        showUpload: false
    })
};

var ue = UE.getEditor('editor');
var y_ue = UE.getEditor('y_editor');
y_ue.ready(function () {
    category_select();
    add_update();
});
UE.Editor.prototype._bkGetActionUrl = UE.Editor.prototype.getActionUrl;
UE.Editor.prototype.getActionUrl = function (action) {
    if (action == 'uploadimage' || action == 'uploadscrawl' || action == 'uploadimage') {
        return '../usdt/ueditor/imgUpload'; //指定访问路径
    } else if (action == 'uploadvideo') {
        return 'http://a.b.com/video.php';
    } else {
        return this._bkGetActionUrl.call(this, action);
    }
}

function ZN_EN(id, state) {
    var message;
    if (state == 1) {
        message = $("#" + id).val();
    } else {
        message = UE.getEditor(id).getContent();
    }
    $.ajax({
        type: "post",
        url: "../usdt/ueditor/BaiduFanYiApi",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            message: message
        },
        success: function (info) {
            if (info.code == 100) {
                if (state == 1) {
                    $("#y_" + id).val(info.en);
                } else {
                    UE.getEditor('y_' + id).setContent(info.en);
                }
            } else {
                $("#tip-public-div").html("翻译不了了。请修改试试");
                $("#tip-public").show();
                return false;
            }
        },
        error: function (err) {
            $("#tip-public-div").html("翻译不了了。请修改试试");
            $("#tip-public").show();
            return false;
        }
    });
}

function category_select() {
    $.ajax({
        type: "post",
        url: "../usdt/sysclass/SysClass",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            style: 3
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                system_category = info.class;
                for (var i in info.class) {
                    var sys_class = info.class[i];
                    str += "<option value='" + sys_class.pid + "'>" + sys_class.name + "</option>";
                }
                $("#add_class").html(str);
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}

function qd_add() {
    var sys_class_id = $("#add_class").val();
    var title = $("#title").val();
    var y_title = $("#y_title").val();
    var img = null;
    var message = UE.getEditor("editor").getContent();
    var y_message = UE.getEditor("y_editor").getContent();
    var synopsis = $("#synopsis").val();
    var y_synopsis = $("#y_synopsis").val();
    var formdata = new FormData();
    formdata.append("sys_class_id", sys_class_id);
    formdata.append("title", title);
    formdata.append("y_title", y_title);
    formdata.append("message", message);
    formdata.append("y_message", y_message);
    formdata.append("img", img);
    formdata.append("synopsis", synopsis);
    formdata.append("y_synopsis", y_synopsis);
    console.info(formdata);
    $.ajax({
        type: "post",
        url: "../usdt/sysnews/SysNewsInsert",
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

function tiaoban() {
    load(index_url_y);
}

function add_update() {
    if (system_new != null) {
        $("#add_class option[value='" + system_new.sys_class_id + "']").attr("selected", "selected");
        $("#title").val(system_new.title);
        $("#y_title").val(system_new.y_title);
        $("#synopsis").val(system_new.synopsis);
        $("#y_synopsis").val(system_new.y_synopsis);
        $("#update_img").show();
        if (system_new.message != null && system_new.message != '') {
            UE.getEditor('editor').setContent(system_new.message);
        }
        if (system_new.y_message != null && system_new.y_message != '') {
            UE.getEditor('y_editor').setContent(system_new.y_message);
        }

        $("#qd").attr("onclick", "qd_update()");
    }
}

function qd_update() {
    var sys_class_id = $("#add_class").val();
    var title = $("#title").val();
    var y_title = $("#y_title").val();
    var img = null;
    var message = UE.getEditor("editor").getContent();
    var y_message = UE.getEditor("y_editor").getContent();
    var synopsis = $("#synopsis").val();
    var y_synopsis = $("#y_synopsis").val();

    var formdata = new FormData();
    formdata.append("sys_class_id", sys_class_id);
    formdata.append("title", title);
    formdata.append("y_title", y_title);
    formdata.append("message", message);
    formdata.append("y_message", y_message);
    formdata.append("img", img);
    formdata.append("pid", system_new.pid);
    formdata.append("synopsis", synopsis);
    formdata.append("y_synopsis", y_synopsis);
    console.info(formdata);
    $.ajax({
        type: "post",
        url: "../usdt/sysnews/SysNewsUpdate",
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
