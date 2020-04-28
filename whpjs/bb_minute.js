var system_minute;
minute_select();

function minute_select() {
    $.ajax({
        type: "post",
        url: "../usdt/bbminute/BbMinuteSelect",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                system_minute = info.minute;
                for (var i in info.minute) {
                    var sys_minute = info.minute[i];
                    str += "<tr name='0'><td><input name=\"checkbox\" type=\"checkbox\" value=\"" + sys_minute.pid + "\"></td>";
                    str += "<td class=\"levels1\">" + sys_minute.name + "</td><td>" + sys_minute.minute + "</td><td>" + format(sys_minute.createtime, "yy/MM/dd HH:mm:ss") + "</td>";
                    if (sys_minute.state == 0) {
                        str += " <td><i class=\"fa fa-check success\"></i></td>  ";
                    } else {
                        str += " <td><i class=\"fa fa-times danger\"></i></td>  ";
                    }

                    str += "</tr>";
                }
                $("#minute_center").html(str);
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
    $(":text").val("");//添加前清空内容
    $("input[type=number]").val("");
    $("#qd").attr("onclick", "qd_add()");
    $("#add_tishi").html("");
    $("#addFile").modal("show");
}

function qd_add() {
    var name = $("#name").val();
    var minute = $("#minute").val();
    alert(minute);
    $.ajax({
        type: "post",
        url: "../usdt/bbminute/BbMinuteAdd",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {name: name, minute: minute},
        success: function (info) {
            if (info.code == 100) {
                alert(22);
                minute_select();
                $("#addFile").modal("hide");
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            alert(33);
            ajax_code(500);

        }
    });

}

var t = new Array();

function update() {
    t = check(1);
    if (t != false) {
        for (var i in system_minute) {
            var minute = system_minute[i];
            if (t[0] == minute.pid) {

                $("#name").val(minute.name);
                $("#minute").val(minute.minute);

            }
        }
        $("#add_tishi").html("修改请慎重，可能出现交易异常。建议在无订单情况下修改");
        $("#qd").attr("onclick", "qd_update()");
        $("#addFile").modal("show");
    }
}

function qd_update() {
    var name = $("#name").val();
    var minute = $("#minute").val();
    alert(minute);

    $.ajax({
        type: "post",
        url: "../usdt/bbminute/BbMinuteUpdate",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {pid: t[0], name: name, minute: minute},
        success: function (info) {
            if (info.code == 100) {
                minute_select();
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
    if (state == 1) {
        t = check(3);
    } else if (state == 2) {
        t = check(4);
    } else if (state == 3) {
        t = check(2);
    }

    if (t != false) {
        del_state = state;
        if (state == 1) {
            $("#myModalLabel").html("开启");
            $("#myModalLabelN").html("确定要开启该盘口？提示：数据可能会出现文件，建议慎重");
        } else if (state == 2) {
            $("#myModalLabel").html("停用");
            $("#myModalLabelN").html("确定要停用该盘口？提示：数据可能会出现文件，建议慎重");
        } else if (state == 3) {
            $("#myModalLabel").html("删除");
            $("#myModalLabelN").html("确定要删除该盘口？提示：数据可能会出现文件，建议慎重");
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
        url: "../usdt/bbminute/BbMinuteDel",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {pid: t, state: z, isdel: isdel},
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                minute_select();
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
