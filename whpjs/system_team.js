var system_team;
team_select();
grade_select();

function team_select() {
    $.ajax({
        type: "post",
        url: "../usdt/systeam/SysteamSelect",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                system_team = info.team;
                for (var i in info.team) {
                    var team = info.team[i];
                    str += "<tr name='0'><td><input name=\"checkbox\" type=\"checkbox\" value=\"" + team.pid + "\"></td>";
                    str += "<td>" + team.grade_name + "</td><td>" + unde(team.bfb * 1000 / 10) + "%</td><td>" + team.level + "</td>";
                    if (team.state == 0) {
                        str += " <td><i class=\"fa fa-check success\"></i></td>  ";
                    } else {
                        str += " <td><i class=\"fa fa-times danger\"></i></td>  ";
                    }
                    str += "</tr>";
                }
                $("#team_center").html(str);
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
    $("#addFile").modal("show");
}

function grade_select() {
    $.ajax({
        type: "post",
        url: "../usdt/sysgrade/SysGradeSelect",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                system_grade = info.grade;
                for (var i in info.grade) {
                    str += "<option value='" + info.grade[i].pid + "'>" + info.grade[i].name + "</option>";
                }
                $("#style").html(str);
            }
        },
        error: function (err) {

        }
    })
}

function qd_add() {
    var sys_grade_id = $("#style").val();
    var bfb = $("#bfb").val();
    var level = $("#level").val();

    $.ajax({
        type: "post",
        url: "../usdt/systeam/SysTeamInsert",
        async: true,
        dataType: "json",
        data: {
            sys_grade_id: sys_grade_id,
            bfb: bfb,
            level: level
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (info) {
            if (info.code == 100) {
                team_select();
                $("#addFile").modal("hide");
            }
        },
        error: function (err) {

        }
    })
}

var t = new Array();

function update() {
    t = check(1);
    if (t != false) {
        for (var i in system_team) {
            var team = system_team[i];
            if (team.pid == t[0]) {
                $("#style").find("option[value='" + team.sys_grade_id + "']").attr("selected", true);
                $("#bfb").find("option[value='" + team.bfb + "']").attr("selected", true);
                $("#level").find("option[value='" + team.level + "']").attr("selected", true);
            }
        }


        $("#qd").attr("onclick", "qd_update()");
        $("#addFile").modal("show");
    }
}

function qd_update() {
    var sys_grade_id = $("#style").val();
    var bfb = $("#bfb").val();
    var level = $("#level").val();

    $.ajax({
        type: "post",
        url: "../usdt/systeam/SysTeamUpdate",
        async: true,
        dataType: "json",
        data: {
            sys_grade_id: sys_grade_id,
            bfb: bfb,
            level: level,
            pid: t[0]
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (info) {
            if (info.code == 100) {
                team_select();
                $("#addFile").modal("hide");
            }
        },
        error: function (err) {

        }
    })
}

var wstate = 0;

function del(state) {
    wstate = state;
    t = check(2);
    if (t != false) {
        if (state == 1) {
            $("#myModalLabel").html("启用");
            $("#myModalLabelN").html("确定要启用？");
        }
        if (state == 2) {
            $("#myModalLabel").html("禁用");
            $("#myModalLabelN").html("确定要禁用？");
        }
        if (state == 3) {
            $("#myModalLabel").html("删除");
            $("#myModalLabelN").html("确定要删除？");
        }

        $("#delFile").modal("show");
    }
}

function qd_del() {
    var state;
    var isdel;
    if (wstate == 1) {
        state = 0;
    }
    if (wstate == 2) {
        state = 1;
    }
    if (wstate == 3) {
        isdel = 1;
    }
    $.ajax({
        type: "post",
        url: "../usdt/systeam/SysTeamDel",
        async: true,
        dataType: "json",
        data: {
            state: state,
            isdel: isdel,
            pid: t
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (info) {
            if (info.code == 100) {
                team_select();
                $("#delFile").modal("hide");
            }
        },
        error: function (err) {

        }
    })
}
