var sys_grade;
var sub_user;
var name = "";
var class_id = "";
var bobi_pid = "";
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
                sys_grade = info.grade;
                str += "<li class=\"active\" name='z-ul-li' onclick='class_qh(\"\",this)'><a href=\"javascript:void(0)\">全部分类</a></li>";
                for (var i in info.grade) {
                    var grade = info.grade[i];
                    str += "<li name='z-ul-li' onclick='class_qh(\"" + grade.pid + "\",this)'><a href=\"javascript:void(0)\">" + grade.name + "</a></li>";
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

user_select("", 1);

function user_select(value, page) {
    name = $("#user_name").val();
    var num = parseInt(10);
    var start = (parseInt(page) - 1) * num;
    $.ajax({
        type: "post",
        url: "../usdt/subuser/SubUserSelect",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            start: start,
            num: num,
            name: name,
            sys_grade_id: class_id
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                sub_user = info.user;
                for (var i in info.user) {
                    var user = info.user[i];
                    str += "<tr><td><input name=\"checkbox\" type=\"checkbox\" value=\"" + user.pid + "\"></td> ";
                    str += "<td><img src=\"" + user.img + "\" width=50 height=50 onerror='imgExists(this,0)'/></td>";
                    str += "<td>" + unde(user.username) + "</td>";
                    str += "<td>" + unde(user.phone) + "</td>";
                    str += "<td>" + unde(user.email) + "</td>";
                    str += "<td>" + unde(user.nickname) + "</td>";
                    if (user.real_name == 1) {
                        str += "<td>已实名</td>";
                    } else if (user.real_name == 0) {
                        str += "<td>未实名</td>";
                    } else {
                        str += "<td>审核失败</td>";
                    }
                    str += "<td>" + unde(user.sid) + "</td>";
                    str += " <td>" + unde(user.t_nickname) + "</td>";

                    str += " <td>" + unde(user.grade_name) + "</td>";
                    str += " <td>" + unde(user.wallet) + "</td>";
                    str += " <td>" + unde(user.money) + "</td>";
                    str += " <td>" + unde(user.surplus) + "</td>";
                    str += " <td>" + unde(user.trade) + "</td>";
                    str += " <td>" + unde(user.income) + "</td>";
                    str += " <td>" + unde(user.loss) + "</td>";
                    str += "<td>" + unde(user.referee) + "</td>";
                    str += "<td>" + unde(user.team_num) + "</td>";
                    if (user.trader == 0) {
                        str += "<td>no</td> ";
                    } else {
                        str += "<td>yes</td> ";
                    }

                    str += "<td>" + format(user.createtime, "yy/MM/dd HH:mm:ss") + "</td> ";
                    if (user.state == 0) {
                        str += " <td><i class=\"fa fa-check success\"></i></td>  ";
                    } else {
                        str += " <td><i class=\"fa fa-times danger\"></i></td>  ";
                    }
                    str += " <td><button type='button' class='btn btn-success' onclick=\"bobi('" + user.pid + "')\">拨币 </button></td>  ";
                    str += "</tr>";
                }
            } else {
                ajax_code(info.code);
            }
            $("#user_center").html(str);
            center_fy("user_select", value, page, num, info.count);
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}

function class_qh(pid, th) {
    class_id = pid;
    $("[name='z-ul-li']").removeClass("active");
    $(th).addClass("active");
    user_select("", 1);
}

var t = new Array();
var update_state = 1;

function update(state) {
    t = check(1);
    if (t != false) {
        $(":text").val("");
        update_state = state;
        if (state == 1) {
            $("#myModalLabel").html("修改等级");
            $("#update-dj").show();
            $("#update-mm").hide();
            $("#update-mm2").hide();
            var str = "";
            for (var i in sub_user) {
                var user = sub_user[i];
                if (t[0] == user.pid) {
                    for (var j in sys_grade) {
                        var grade = sys_grade[j];
                        if (grade.pid == user.sys_grade_id) {
                            str += "<option value=" + grade.pid + " selected>" + grade.name + "</option>";
                        } else {
                            str += "<option value=" + grade.pid + ">" + grade.name + "</option>";
                        }
                    }
                }
            }
            $("#update_grade").html(str);
        } else {
            $("#myModalLabel").html("修改密码");
            $("#update-dj").hide();
            $("#update-mm").show();
            $("#update-mm2").show();
        }
        $("#fileStorage").modal("show");
    }
}

function qd_update() {
    var sys_grade_id;
    var password;
    var trade_password;
    if (update_state == 1) {
        sys_grade_id = $("#update_grade").val();
    } else {
        password = $("#password").val();
        trade_password = $("#trade_password").val();
    }
    $.ajax({
        type: "post",
        url: "../usdt/subuser/SubUserUpdate",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            pid: t[0],
            password: password,
            trade_password: trade_password,
            sys_grade_id: sys_grade_id
        },
        success: function (info) {
            if (info.code == 100) {
                user_select("", 1);
                $("#fileStorage").modal("hide");
            } else {
                ajax_code(info.code);
            }

        },
        error: function (err) {
            ajax_code(500);

        }
    });
}

var del_state = 2;

function del(state) {
    t = check(2);
    if (t != false) {
        del_state = state;
        if (state == 2) {
            $("#myModalLabelDel").html("删除");
            $("#myModalLabelN").html("确定要删除？");
        } else if (state == 1) {
            $("#myModalLabelDel").html("开启/冻结");
            $("#myModalLabelN").html("确定要冻结？");
        } else {
            $("#myModalLabelDel").html("开启/冻结");
            $("#myModalLabelN").html("确定要开启？");
        }
        $("#delFile").modal("show");
    }
}

function qd_del() {
    var state;
    var isdel;
    if (del_state == 0) {
        state = 0;
    } else if (del_state == 1) {
        state = 1;
    } else {
        isdel = 1;
    }
    $.ajax({
        type: "post",
        url: "../usdt/subuser/SubUserDel",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            pid: t,
            state: state,
            isdel: isdel
        },
        success: function (info) {
            if (info.code == 100) {
                user_select("", 1);
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

function team() {
    t = check(1);
    if (t != false) {
        report_userid = t[0];
        load("recursion.html");
    }
}

function bobi(pid) {
    $("#BoBiFile").modal("show");
    bobi_pid = pid;
}

function qd_bobi() {
    var money = $("#bobi").val();
    if (money > 0) {
        $("#bobi_tishi").html("");
        $.ajax({
            type: "post",
            url: "../usdt/subuser/SubMoneyInsert",
            async: true,
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', token);
            },
            data: {
                pid: bobi_pid,
                money: money
            },
            success: function (info) {
                if (info.code == 100) {
                    $("#BoBiFile").modal("hide");
                    public_tishi("拨币成功!");
                } else {
                    ajax_code(info.code);
                }

            },
            error: function (err) {
                ajax_code(500);

            }
        });
    } else {
        $("#bobi_tishi").html("请输入金额并且不能小于或等于0");
    }
}
