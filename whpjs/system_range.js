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
                str += "<li class=\"active\" name='z-ul-li' onclick='class_qh(\"\",this)'><a href=\"javascript:void(0)\">全部</a></li>";

                for (var i in info.minute) {
                    var sys_minute = info.minute[i];
                    var style_name;
                    if (sys_minute.style == 0) {
                        style_name = "A盘";
                    } else {
                        style_name = "B盘";
                    }

                    str += "<li name='z-ul-li' onclick='class_qh(\"" + sys_minute.pid + "\",this)'><a href=\"javascript:void(0)\">" + style_name + ":" + sys_minute.name + "</a></li>";


                }
                $("#top-class").html(str);
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}

var class_id;

function class_qh(pid, th) {
    class_id = pid;
    $("[name='z-ul-li']").removeClass("active");
    $(th).addClass("active");
    range_select();
}

range_select();

function range_select() {
    $.ajax({
        type: "post",
        url: "../usdt/sysrange/SysRangeSelect",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {sys_minute_id: class_id},
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                system_range = info.range;
                for (var i in info.range) {
                    var range = info.range[i];
                    str += "<tr><td><input name=\"checkbox\" type=\"checkbox\" value=\"" + range.pid + "\"></td> ";
                    if (range.style == 0) {
                        str += "<td>涨</td>";
                    } else {
                        str += "<td>跌</td>";
                    }
                    str += "<td>" + range.range + "%</td>";
                    var system_minute_name;
                    for (var j in system_minute) {
                        if (system_minute[j].pid == range.sys_minute_id) {
                            var minute_style;
                            if (system_minute[j].style == 0) {
                                minute_style = "A盘";
                            } else {
                                minute_style = "B盘";
                            }
                            system_minute_name = minute_style + ":" + system_minute[j].name;
                        }
                    }
                    str += "<td>" + system_minute_name + "</td>";
                    if (range.state == 0) {
                        str += " <td><i class=\"fa fa-check success\"></i></td>  ";
                    } else {
                        str += " <td><i class=\"fa fa-times danger\"></i></td>  ";
                    }
                }
                $("#range_center").html(str);
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
    var str;
    for (var i in system_minute) {
        var sys_minute = system_minute[i];
        var style_name;
        if (sys_minute.style == 0) {
            style_name = "A盘";
        } else {
            style_name = "B盘";
        }
        str += "<option value=" + sys_minute.pid + ">" + style_name + ":" + sys_minute.name + "</option>";
    }
    $("#minute").html(str);
    $("#qd").attr("onclick", "qd_add()");
    $("#addFile").modal("show");
}

function qd_add() {
    var minute = $("#minute").val();
    var range = $("#range").val();
    var style = $("#style").val();
    $.ajax({
        type: "post",
        url: "../usdt/sysrange/SysRangeInsert",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {style: style, sys_minute_id: minute, range: range},
        success: function (info) {
            if (info.code == 100) {
                range_select();
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
        $("#qd").attr("onclick", "qd_update()");
        for (var j in system_range) {
            var range = system_range[j];
            if (range.pid == t[0]) {
                var str;
                for (var i in system_minute) {
                    var sys_minute = system_minute[i];
                    var style_name;
                    if (sys_minute.style == 0) {
                        style_name = "A盘";
                    } else {
                        style_name = "B盘";
                    }
                    if (range.sys_minute_id == sys_minute.pid) {
                        str += "<option value=" + sys_minute.pid + " selected>" + style_name + ":" + sys_minute.name + "</option>";
                    } else {
                        str += "<option value=" + sys_minute.pid + ">" + style_name + ":" + sys_minute.name + "</option>";
                    }

                }
                $("#minute").html(str);
                $("#style option[value='" + range.style + "']").attr("selected", "selected");
                $("#range").val(range.range);

            }
        }

        $("#addFile").modal("show");

    }

}

function qd_update() {
    var minute = $("#minute").val();
    var range = $("#range").val();
    var style = $("#style").val();
    $.ajax({
        type: "post",
        url: "../usdt/sysrange/SysRangeUpdate",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {style: style, sys_minute_id: minute, range: range, pid: t[0]},
        success: function (info) {
            if (info.code == 100) {
                range_select();
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
            $("#myModalLabelN").html("确定要开启该交易比例？");
        } else if (state == 2) {
            $("#myModalLabel").html("停用");
            $("#myModalLabelN").html("确定要停用该交易比例？");
        } else if (state == 3) {
            $("#myModalLabel").html("删除");
            $("#myModalLabelN").html("确定要删除该交易比例？");
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
        url: "../usdt/sysrange/SysRangeDel",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {pid: t, state: z, isdel: isdel},
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                range_select();
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

