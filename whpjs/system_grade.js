var grade_type = {
    "1": "V1注册+奖励",
    "2": "V2实名+奖励",
    "3": "V3交易累计金额+星级朋友+提成",
    "4": "V4升级交易员+星级朋友+提成",
    "5": "V5升级交易员+星级朋友+提成"
};
var system_grade;
grade_select();

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
                    var grade = info.grade[i];
                    str += "<tr><td><input name=\"checkbox\" type=\"checkbox\" value=\"" + grade.pid + "\"></td> ";
                    str += "<td>" + grade.name + "</td>";
                    for (var key in grade_type) {
                        if (key == grade.type) {
                            str += "<td>" + grade_type[key] + "</td>";
                        }
                    }
                    str += "<td>" + grade.money + "</td>";
                    str += "<td>" + grade.consume + "</td>";
                    str += "<td>" + grade.extract + "</td>";
                    str += "<td>" + grade.charge + "</td>";
                    str += "<td>" + unde(grade.grade_name) + "</td>";
                    str += "<td>" + grade.num + "</td>";
                    if (grade.state == 0) {
                        str += " <td><i class=\"fa fa-check success\"></i></td>  ";
                    } else {
                        str += " <td><i class=\"fa fa-times danger\"></i></td>  ";
                    }
                    str += "</tr>";
                }
                $("#grade_center").html(str);
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
    for (var key in grade_type) {
        str += "<option value=" + key + ">" + grade_type[key] + "</option>";
    }
    $("#add_type").html(str);
    var str1 = "<option value='0'>无</option>";
    for (var i in system_grade) {
        str1 += "<option value=" + system_grade[i].pid + ">" + system_grade[i].name + "</option>";
    }
    $("#add_grade_pid").html(str1);

    $("#addFile").modal("show");
}

function qd_add() {
    var type = $("#add_type").val();
    var name = $("#name").val();
    var money = $("#money").val();
    var extract = $("#extract").val();
    var num = $("#num").val();
    var charge = $("#charge").val();
    var consume = $("#consume").val();
    var sys_grade_id = $("#add_grade_pid").val();
    var role = "V" + type;
    $.ajax({
        type: "post",
        url: "../usdt/sysgrade/SysGradeInsert",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            type: type,
            name: name,
            money: money,
            extract: extract,
            num: num,
            charge: charge,
            sys_grade_id: sys_grade_id,
            role: role,
            consume: consume
        },
        success: function (info) {
            if (info.code == 100) {
                grade_select();
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
        for (var i in system_grade) {
            var grade = system_grade[i];
            if (grade.pid == t[0]) {
                $("#name").val(grade.name);
                $("#money").val(grade.money);
                $("#extract").val(grade.extract);
                $("#consume").val(grade.consume);
                $("#charge").val(grade.charge);
                $("#num").val(grade.num);
                var str = "";
                for (var key in grade_type) {
                    if (grade.type == key) {
                        str += "<option value=" + key + " selected>" + grade_type[key] + "</option>";
                    } else {
                        str += "<option value=" + key + ">" + grade_type[key] + "</option>";
                    }
                }
                $("#add_type").html(str);
                $("#name").val(grade.name);
                var str1 = "";
                if (grade.sys_grade_id == 0) {
                    str1 += "<option value=0 selected>暂无</option>";
                } else {
                    str1 += "<option value=0>暂无</option>";
                }
                for (var j in system_grade) {
                    var j_grade = system_grade[j];
                    if (grade.sys_grade_id == j_grade.pid) {
                        str1 += "<option value=" + j_grade.pid + " selected>" + j_grade.name + "</option>";
                    } else {
                        str1 += "<option value=" + j_grade.pid + ">" + j_grade.name + "</option>";
                    }
                }
                $("#add_grade_pid").html(str1);

            }
        }
        $("#qd").attr("onclick", "qd_update()");
        $("#addFile").modal("show");
    }
}


function qd_update() {
    var type = $("#add_type").val();
    var name = $("#name").val();
    var money = $("#money").val();
    var extract = $("#extract").val();
    var num = $("#num").val();
    var charge = $("#charge").val();
    var sys_grade_id = $("#add_grade_pid").val();
    var role = "V" + type;
    var consume = $("#consume").val();
    $.ajax({
        type: "post",
        url: "../usdt/sysgrade/SysGradeUpdate",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            pid: t[0],
            type: type,
            name: name,
            money: money,
            extract: extract,
            num: num,
            charge: charge,
            sys_grade_id: sys_grade_id,
            role: role,
            consume: consume
        },
        success: function (info) {
            if (info.code == 100) {
                grade_select();
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

function del() {
    t = check(2);
    if (t != false) {
        $("#delFile").modal("show");
    }
}

function qd_del() {
    $.ajax({
        type: "post",
        url: "../usdt/sysgrade/SysGradeDel",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            pid: t,
            isdel: 1
        },
        success: function (info) {
            if (info.code == 100) {
                grade_select();
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
