var name;
var process;
var sub_user_real;
user_real_select("", 1);

function user_real_select(value, page) {
    name = $("#user_name").val();
    var num = parseInt(10);
    var start = (parseInt(page) - 1) * num;
    $.ajax({
        type: "post",
        url: "../usdt/subuserreal/SubUserRealSelect",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            start: start,
            num: num,
            name: name,
            process: process
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                sub_user_real = info.real;
                for (var i in info.real) {
                    var real = info.real[i];
                    str += "<tr><td><input name=\"checkbox\" type=\"checkbox\" value=\"" + real.pid + "\"></td> ";
                    str += "<td><img src=\"" + real.user_img + "\" width=50 height=50 onerror='imgExists(this,0)'/></td>";
                    str += "<td>" + unde(real.phone) + "</td>";
                    str += "<td>" + unde(real.email) + "</td>";
                    str += "<td>" + unde(real.nickname) + "</td>";
                    if (real.process == 1) {
                        str += "<td>审核成功</td>";
                    } else if (real.process == 0) {
                        str += "<td>等待审核</td>";
                    } else {
                        str += "<td>审核失败</td>";
                    }
                    str += "<td>" + unde(real.realname) + "</td>";
                    str += "<td>" + unde(real.idcard) + "</td>";
                    str += "<td><img src=\"" + real.img + "\" width=50 height=50 onerror='imgExists(this,0)' onclick='ImgFile(\"" + real.img + "\")' /></td>";
                    str += "<td>" + format(real.createtime, "yy/MM/dd HH:mm:ss") + "</td> ";
                    str += "<td>" + unde(real.memo) + "</td>";
                    if (real.process == 0) {
                        str += "<td><button type='button' class='btn btn-info' onclick='update(\"" + real.pid + "\",1)'>审核</button></td>";
                    } else {
                        str += "<td><button type='button' class='btn btn-success' onclick='update(\"" + real.pid + "\",2)'>查看</button></td>";
                    }

                }
                $("#user_center").html(str);
                center_fy("user_real_select", value, page, num, info.count);
            }
        },
        error: function (err) {

        }
    })
}

function class_qh(pid, th) {
    process = pid;
    $("[name='z-ul-li']").removeClass("active");
    $(th).addClass("active");
    user_real_select("", 1);
}

var real_id;
var user_id;

function update(pid, state) {
    for (var i in sub_user_real) {
        var real = sub_user_real[i];
        if (real.pid == pid) {
            real_id = pid;
            user_id = real.user_pid;
            $("#realname").val(real.realname);
            $("#idcard").val(real.idcard);
            $("#img").attr("src", real.img);
            if (state == 1) {
                $("#process").find("option[value='1']").attr("selected", true);
                $("#process").removeAttr("disabled");
                $("#memo").val("");
                $("#memo").removeAttr("disabled");
                $("#add_memo").hide();
                $("#qd").show();
            } else {
                $("#process").find("option[value='" + real.process + "']").attr("selected", true);
                $("#process").attr("disabled", "disabled");
                if (real.process == 2) {
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
    if (value == 1) {
        $("#memo").val("");
        $("#add_memo").hide();
    } else {
        $("#add_memo").show();
    }
}

function qd_update() {
    var process_code = $("#process").val();
    var memo;
    if (process_code == 2) {
        memo = $("#memo").val();
    }
    $.ajax({
        type: "post",
        url: "../usdt/subuserreal/SubUserRealUpdate",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            process: process_code,
            memo: memo,
            userid: user_id,
            pid: real_id
        },
        success: function (info) {
            if (info.code == 100) {
                user_real_select("", 1);
                $("#fileStorage").modal("hide");
            } else if (info.code == 103) {

            } else {

            }
        },
        error: function (err) {

        }
    })

}

function ImgFile(src) {
    $("#Z_img").attr("src", src);
    $("#ImgFile").modal("show");
}

function del() {
    t = check(2);
    if (t != false) {

        $("#myModalLabelDel").html("删除");
        $("#myModalLabelN").html("确定要删除？");
        $("#delFile").modal("show");
    }
}

function qd_del() {

    $.ajax({
        type: "post",
        url: "../usdt/subuserreal/SubUserRealDel",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            pid: t
        },
        success: function (info) {
            if (info.code == 100) {
                user_real_select("", 1);
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
