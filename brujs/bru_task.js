var state = -1;
var user_task;

getTaskByCondition("", 1);

function getTaskByCondition(value, page) {
    var num = parseInt(10);
    var start = (parseInt(page) - 1) * num;
    var name = $("#name").val();
    $.ajax({
        type: "get",
        url: "../usdt/usertask/getUserTaskByCondition",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            num: num,
            start: start,
            state: state,
            name: name
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                user_task = info.task;
                for (var i in info.task) {
                    var task = info.task[i];
                    str += "<tr><td><input name=\"checkbox\" type=\"checkbox\" value=\"" + task.pid + "\"></td> ";
                    str += "<td>" + unde(task.nickname) + "</td>";
                    str += "<td>" + unde(task.tasktitle) + "</td>";
                    if (task.level == 0) {
                        str += "<td>初级</td>";
                    } else if (task.level == 1) {
                        str += "<td>中级</td>";
                    } else if (task.level == 2) {
                        str += "<td>高级</td>";
                    }

                    str += "<td>" + unde(task.channel) + "</td>";
                    if (task.bstate == 0) {
                        str += "<td>BRU</td>";
                    } else {
                        str += "<td>活跃度</td>";
                    }
                    str += "<td>" + unde(task.begintime) + "</td>";
                    str += "<td>" + unde(task.endtime) + "</td>";
                    if (typeof (task.img1) == "undefined") {
                        str += "<td></td>";
                    } else {
                        str += "<td><img src=\"" + task.img1 + "\" width=50 height=50 onerror='imgExists(this,0)' onclick='ImgFile(\"" + task.img1 + "\")' /></td>";
                    }
                    if (typeof (task.img2) == "undefined") {
                        str += "<td></td>";
                    } else {

                        str += "<td><img src=\"" + task.img2 + "\" width=50 height=50 onerror='imgExists(this,0)' onclick='ImgFile(\"" + task.img2 + "\")' /></td>";
                    }
                    if (typeof (task.img3) == "undefined") {
                        str += "<td></td>";
                    } else {
                        str += "<td><img src=\"" + task.img3 + "\" width=50 height=50 onerror='imgExists(this,0)' onclick='ImgFile(\"" + task.img3 + "\")' /></td>";
                    }

                    if (task.state == 0) {
                        str += "<td>已领取</td>";
                    } else if (task.state == 1) {
                        str += "<td>已提交</td>";
                    } else if (task.state == 2) {
                        str += "<td>完成</td>";
                    } else if (task.state == 3) {
                        str += "<td>未通过</td>";
                    } else if (task.state == 4) {
                        str += "<td>任务超时</td>";
                    }
                    if (task.state == 1) {
                        str += "<td><button type='button' class='btn btn-info' onclick='update(\"" + task.pid + "\",1)'>审核</button></td>";
                    } else {
                        str += "<td><button type='button' class='btn btn-success' onclick='update(\"" + task.pid + "\",2)'>查看</button></td>";
                    }

                }
                $("#user_center").html(str);
                center_fy("getTaskByCondition", value, page, num, info.count);
            } else if (info.code == 101) {
                $("#user_center").html("");
                center_fy("getTaskByCondition", value, page, num, 0);
            }
        },
        error: function (err) {

        }
    });
}

function class_qh(pid, th) {
    state = pid;
    $("[name='z-ul-li']").removeClass("active");
    $(th).addClass("active");
    getTaskByCondition("", 1);
}

var task_id;

function update(pid, lsstate) {
    for (var i in user_task) {
        var real = user_task[i];
        if (real.pid == pid) {
            task_id = pid;
            $("#tasktitle").val(real.tasktitle);
            if (real.level == 0) {
                $("#level").val("初级");
            } else if (real.level == 1) {
                $("#level").val("中级");
            } else if (real.level == 2) {
                $("#level").val("高级");
            }

            $("#img1").attr("src", real.img1);
            $("#img2").attr("src", real.img2);
            $("#img3").attr("src", real.img3);
            if (lsstate == 1) {
                $("#process").empty();
                var str = "<option value='2'>审核通过</option><option value='3'>审核不通过</option>";
                $("#process").append(str);
                $("#prcoess").find("option[value='2']").attr("selected", true);
                $("#process").removeAttr("disabled");
                $("#memo").val("");
                $("#memo").removeAttr("disabled");
                $("#add_memo").hide();
                $("#qd").show();
            } else {
                $("#process").empty();
                var str = "<option value='0'>已领取</option><option value='1'>已提交</option><option value='2'>审核通过</option><option value='3'>审核不通过</option><option value='4'>任务超时</option>";
                $("#process").append(str);
                $("#process").find("option[value='" + real.state + "']").attr("selected", true);
                $("#process").attr("disabled", "disabled");
                if (real.state == 3) {
                    $("#memo").val(real.memo);
                    $("#memo").attr("disabled", "disabled");
                    $("#add_memo").show();
                }
                $("#qd").hide();
            }
        }
    }

    $("#fileStorage").modal("show");
}

function update_type(value) {
    if (value == 2) {
        $("#memo").val("");
        $("#add_memo").hide();
    } else if (value == 3) {
        $("#add_memo").show();
    } else {
        $("#memo").val("");
        $("#add_memo").hide();
    }
}

function ImgFile(src) {
    $("#Z_img").attr("src", src);
    $("#ImgFile").modal("show");
}

function qd_update() {
    var process_code = $("#process").val();
    var reason = '';
    if (process_code == 3) {
        reason = $("#memo").val();
    }
    $.ajax({
        type: "post",
        url: "../usdt/usertask/auditUserTask",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            taskid: task_id,
            state: process_code,
            reason: reason
        },
        success: function (info) {
            if (info.code == 100) {
                getTaskByCondition("", 1);
                $("#fileStorage").modal("hide");
            } else if (info.code == 103) {

            } else {

            }
        },
        error: function (err) {

        }
    });

}

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
    $.ajax({
        type: "POST",
        url: "../usdt/usertask/delUserTask",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            id: t
        },
        success: function (info) {
            if (info.code == 100) {
                getTaskByCondition("", 1);
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