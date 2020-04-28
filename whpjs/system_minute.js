var system_minute;
minute_select();

function minute_select() {
    $.ajax({
        type: "post",
        url: "../usdt/sysminute/SysMinuteSelect",
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
                    str += "<td class=\"levels1\">" + sys_minute.name + "</td><td>" + unde(sys_minute.y_name) + "</td><td>" + sys_minute.minute + "</td><td>" + sys_minute.end_minute + "</td>";
                    if (sys_minute.state == 0) {
                        str += " <td><i class=\"fa fa-check success\"></i></td>  ";
                    } else {
                        str += " <td><i class=\"fa fa-times danger\"></i></td>  ";
                    }
                    if (sys_minute.style == 0) {
                        str += " <td>A盘</td>  ";
                    } else {
                        str += " <td>B盘</td>  ";
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
    $(":text").val("");
    $("input[type=number]").val("");
    $("#qd").attr("onclick", "qd_add()");
    $("#add_tishi").html("");
    $("#style").html("<option value=0>A盘</option><option value=1>B盘</option>");
    $("#addFile").modal("show");
}

function qd_add() {
    var style = $("#style").val();
    var name = $("#name").val();
    var y_name = $("#y_name").val();
    var minute = $("#minute").val();
    var end_minute = $("#end_minute").val();
    if (end_minute > minute) {
        $("#add_tishi").html("盘口购买时间要小于等于盘口周期");
        return false;
    }
    $.ajax({
        type: "post",
        url: "../usdt/sysminute/SysMinuteInsert",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {style: style, name: name, y_name: y_name, minute: minute, end_minute: end_minute},
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

var t = new Array();

function update() {
    t = check(1);
    if (t != false) {
        for (var i in system_minute) {
            var minute = system_minute[i];
            if (t[0] == minute.pid) {
                console.info(minute.style);
                if (minute.style == 0) {
                    $("#style").html("<option value=" + minute.style + ">A盘</option>");
                } else {
                    $("#style").html("<option value=" + minute.style + ">B盘</option>");
                }
                $("#name").val(minute.name);
                $("#y_name").val(minute.y_name);
                $("#minute").val(minute.minute);
                $("#end_minute").val(minute.end_minute);
            }
        }
        $("#add_tishi").html("修改请慎重，可能出现交易异常。建议在无订单情况下修改");
        $("#qd").attr("onclick", "qd_update()");
        $("#addFile").modal("show");
    }
}

function qd_update() {
    var name = $("#name").val();
    var y_name = $("#y_name").val();
    var minute = $("#minute").val();
    var end_minute = $("#end_minute").val();
    if (end_minute > minute) {
        $("#add_tishi").html("盘口购买时间要小于等于盘口周期");
        return false;
    }
    $.ajax({
        type: "post",
        url: "../usdt/sysminute/SysMinuteUpdate",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {pid: t[0], name: name, y_name: y_name, minute: minute, end_minute: end_minute},
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
    t = check(2);
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
        url: "../usdt/sysminute/SysMinuteDel",
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