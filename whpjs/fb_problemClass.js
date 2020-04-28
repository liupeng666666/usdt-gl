var fb_problemClass;
problemClassInfo_select();

function problemClassInfo_select() {
    $.ajax({
        type: "post",
        url: "../usdt/FbProblemClass/FbProblemClassSelect",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                fb_problemClass = info.problemClass;
                for (var i in info.problemClass) {
                    var problemClass = info.problemClass[i];
                    str += "<tr name='0'><td><input name=\"checkbox\" type=\"checkbox\" value=\"" + problemClass.pid + "\"></td>";
                    str += "<td class=\"levels1\">" + problemClass.title + "</td>";
                    if (problemClass.state == 0) {
                        str += " <td><i class=\"fa fa-check success\"></i></td>  ";
                    } else {
                        str += " <td><i class=\"fa fa-times danger\"></i></td>  ";
                    }
                    str += "</tr>";
                }
                $("#problemClass_center").html(str);
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
    $("#message").html("");
    $("#qd").attr("onclick", "qd_add()");
    $("#addFile").modal("show");
}

function qd_add() {
    var problemClass_title = $("#problemClass_title").val();
    if (problemClass_title == null || problemClass_title == "") {
        $("#message").html("问题分类名称不能为空！");
        return false;
    }

    $.ajax({
        type: "post",
        url: "../usdt/FbProblemClass/FbProblemClassInsert",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            title: problemClass_title
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                problemClassInfo_select();
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

    $("#message").html("");
    t = check(1);
    if (t != false) {
        for (var i in fb_problemClass) {
            var problemClass = fb_problemClass[i];
            if (problemClass.pid == t[0]) {
                $("#problemClass_title").val(problemClass.title);
            }
        }

        $("#qd").attr("onclick", "qd_update()");
        $("#addFile").modal("show");
    }
}

function qd_update() {

    var problemClass_title = $("#problemClass_title").val();
    if (problemClass_title == null || problemClass_title == "") {
        $("#message").html("问题分类名称不能为空！");
        return false;
    }

    $.ajax({
        type: "post",
        url: "../usdt/FbProblemClass/FbProblemClassUpdate",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            pid: t[0],
            title: problemClass_title
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                problemClassInfo_select();
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
            $("#myModalDelLabel").html("开启");
            $("#myModalDelLabelN").html("确定要开启问题分类？");
        } else if (state == 2) {
            $("#myModalDelLabel").html("停用");
            $("#myModalDelLabelN").html("确定要停用问题分类？");
        } else if (state == 3) {
            $("#myModalDelLabel").html("删除");
            $("#myModalDelLabelN").html("确定要删除问题分类？");
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
        url: "../usdt/FbProblemClass/FbProblemClassDelete",
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
                problemClassInfo_select();
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
