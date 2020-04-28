var sys_ad_class;
var sys_ad;
ad_class_select();

function ad_class_select() {
    $.ajax({
        type: "post",
        url: "../usdt/sysad/SysAdClassSelect",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (info) {
            var str = "<option value=''>全部</option>";
            var str1 = "";
            if (info.code == 100) {
                sys_ad_class = info.class;
                for (var i in info.class) {
                    var ad_class = info.class[i];
                    str += "<option value=" + ad_class.id + ">" + ad_class.name + "</option>";
                    str1 += "<option value=" + ad_class.id + ">" + ad_class.name + "</option>";
                }
            } else {
                ajax_code(info.code);
            }
            $("#location").html(str);
            $("#add_class").html(str1);
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}

add_select("", 1);

function add_select(value, page) {
    var state = $("#state").val();
    var location = $("#location").val();
    var num = parseInt(10);
    var start = (parseInt(page) - 1) * num;
    $.ajax({
        type: "post",
        url: "../usdt/sysad/SysAdSelect",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            start: start,
            num: num,
            state: state,
            location: location
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                sys_ad = info.ad;
                for (var i in info.ad) {
                    var ad = info.ad[i];
                    str += "<tr><td><input name=\"checkbox\" type=\"checkbox\" value=\"" + ad.pid + "\"></td> ";
                    str += "<td>" + ad.describe + "</td>";
                    str += "<td>";
                    if (ad.img != "" && ad.img != null) {
                        var imgs = JSON.parse(ad.img);

                        for (var j in imgs) {
                            var img = imgs[j];
                            str += "	<img src=\"" + img + "\" width='50' height='50' onerror='imgExists(this,0)'\>";
                        }
                    }
                    str += "</td>";
                    str += "<td>" + ad.memo + "</td>";
                    if (ad.state == 0) {
                        str += "<td><button type=\"button\" class=\"btn btn-success\" onclick='state(1,\"" + ad.pid + "\",\"" + ad.location + "\")'>关闭</button></td> ";

                    } else {
                        str += "<td><button type=\"button\" class=\"btn btn-danger\" onclick='state(0,\"" + ad.pid + "\",\"" + ad.location + "\")'>开启</button></td> ";
                    }
                    str += "</tr>";
                }
            } else {
                ajax_code(info.code);
            }
            console.info(str);
            $("#sys_center").html(str);
            center_fy("", "add_select", page, num, info.count);
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}

function add() {
    var id = $("#add_class").val();
    add_class_f(id);
    $("#addFile").modal("show");
}

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
var ad_width = 0;
var ad_height = 0;

function add_class_f(id) {
    for (var i in sys_ad_class) {
        var ad_class = sys_ad_class[i];
        if (ad_class.id == id) {
            ad_width = ad_class.width;
            ad_height = ad_class.height;
            $("#add_tishi").html("该位置下图片宽度：" + ad_class.width + "px ,长度：" + ad_class.height + "px。上传图片不足时我们将放大，上传图片过大我们将压缩到指定尺寸下");
        }
    }
}

function qd_add() {
    var location = $("#add_class").val();
    var describe = $("#add_class option:selected").text();
    var file = document.getElementById("file-add").files;

    var memo = $("#memo").val();
    var fromData = new FormData();
    fromData.append("location", location);
    fromData.append("describe", describe);
    for (var i = 0; i < file.length; i++) {
        fromData.append("file[]", file[i]);
    }

    fromData.append("memo", memo);
    fromData.append("width", ad_width);
    fromData.append("height", ad_height);
    $.ajax({
        type: "post",
        url: "../usdt/sysad/SysAdInsert",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: fromData,
        enctype: "multipart/form-data",
        processData: false,
        contentType: false,
        success: function (info) {
            if (info.code == 100) {
                add_select("", 1);
                $("#addFile").modal("hide");
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}

var t = new Array();

function del() {
    t = check(2);
    if (t != false) {
        $("#delFile").modal("show");
    }
}

function qd_del() {
    $.ajax({
        type: "post",
        url: "../usdt/sysad/SysAdDel",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            isdel: 1,
            pid: t
        },
        success: function (info) {
            if (info.code == 100) {
                add_select("", 1);
                $("#delFile").modal("hide");
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}

function state(state, pid, location) {
    $.ajax({
        type: "post",
        url: "../usdt/sysad/SysAdUpdate",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            state: state,
            pid: pid,
            location: location
        },
        success: function (info) {
            if (info.code == 100) {
                add_select("", 1);
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}