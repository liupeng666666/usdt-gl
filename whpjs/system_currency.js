var system_currency;
currency_select();

function currency_select() {
    $.ajax({
        type: "post",
        url: "../usdt/syscurrency/SysCurrency",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                system_currency = info.currency;
                for (var i in info.currency) {
                    var sys_currency = info.currency[i];
                    str += "<tr name='0'><td><input name=\"checkbox\" type=\"checkbox\" value=\"" + sys_currency.pid + "\"></td>";
                    str += "<td><img src=\"" + sys_currency.cimg + "\" width=50 height=50 onerror='imgExists(this,3)'></td>";
                    str += "<td class=\"levels1\">" + sys_currency.name + "</td><td>" + unde(sys_currency.y_name) + "</td><td>" + sys_currency.symbol + "</td>";
                    str += "<td>" + sys_currency.sort + "位</td>";
                    if (sys_currency.state == 0) {
                        str += " <td><i class=\"fa fa-check success\"></i></td>  ";
                    } else {
                        str += " <td><i class=\"fa fa-times danger\"></i></td>  ";
                    }
                    str += "</tr>";
                }
                $("#currency_center").html(str);
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}

function add() {
    $("#qd").attr("onclick", "qd_add()");
    $(":text").val("");
    var str = "";
    for (var i = 1; i < 21; i++) {
        str += "<option value='" + i + "'>第" + i + "位</option>";
    }
    $("#update_img").hide();
    $("#sort").html(str);
    $("#addFile").modal("show");
}

function qd_add() {
    var symbol = $("#symbol").val();
    var name = $("#name").val();
    var y_name = $("#y_name").val();
    var img = document.getElementById("file-add").files[0];
    var sort = $("#sort").val();
    var formdata = new FormData();
    formdata.append("symbol", symbol);
    formdata.append("name", name);
    formdata.append("y_name", y_name);
    formdata.append("sort", sort);
    formdata.append("cimg", img);
    $.ajax({
        type: "post",
        url: "../usdt/syscurrency/SysCurrencyInsert",
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
            var str = "";
            if (info.code == 100) {
                currency_select();
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

function update() {
    t = check(1);
    if (t != false) {
        for (var i in system_currency) {
            var currency = system_currency[i];
            if (currency.pid == t[0]) {
                $("#symbol option[value='" + currency.symbol + "']").attr("selected", "selected");
                $("#name").val(currency.name);
                $("#y_name").val(currency.y_name);
                $("#img").attr("src", currency.cimg);
                var str = "";
                for (var i = 1; i < 21; i++) {
                    if (currency.sort == i) {
                        str += "<option value='" + i + "' selected>第" + i + "位</option>";
                    } else {
                        str += "<option value='" + i + "'>第" + i + "位</option>";
                    }

                }
                $("#sort").html(str);
            }
        }
        $("#update_img").show();
        $("#qd").attr("onclick", "qd_update()");
        $("#addFile").modal("show");
    }
}

function qd_update() {
    var symbol = $("#symbol").val();
    var name = $("#name").val();
    var y_name = $("#y_name").val();
    var img = document.getElementById("file-add").files[0];
    var sort = $("#sort").val();
    var formdata = new FormData();
    formdata.append("symbol", symbol);
    formdata.append("name", name);
    formdata.append("y_name", y_name);
    formdata.append("sort", sort);
    formdata.append("cimg", img);
    formdata.append("pid", t[0]);
    $.ajax({
        type: "post",
        url: "../usdt/syscurrency/SysCurrencyUpdate",
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
            var str = "";
            if (info.code == 100) {
                currency_select();
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

function del(state) {
    t = check(2);
    if (t != false) {
        del_state = state;
        if (state == 1) {
            $("#myModalLabel").html("开启");
            $("#myModalLabelN").html("确定要开启虚拟币？");
        } else if (state == 2) {
            $("#myModalLabel").html("停用");
            $("#myModalLabelN").html("确定要停用虚拟币？");
        } else if (state == 3) {
            $("#myModalLabel").html("删除");
            $("#myModalLabelN").html("确定要删除虚拟币？");
        }
        $("#qddel").attr("onclick", "qd_del(" + state + ")");
        $("#delFile").modal("show");
    }
}

function qd_del(state) {
    var isdel = "";
    var z = "";
    if (state == 1) {
        z = "0";
    } else if (state == 2) {
        z = "1";
    } else {
        isdel = "1";
    }

    $.ajax({
        type: "post",
        url: "../usdt/syscurrency/SysCurrencyDel",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            pid: t,
            state: z,
            isdel: isdel
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                currency_select();
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