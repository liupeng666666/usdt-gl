var sub_usdt;
var examine;
var usdt_style;
var codeid;
var usdt_codeid;
var usdt_type;

function usdt_select(value, page) {
    name = $("#user_name").val();
    var num = parseInt(10);
    var start = (parseInt(page) - 1) * num;
    var starttime = $("#datetimepicker").val();
    var endtime = $("#datetimepicker2").val();
    $.ajax({
        type: "post",
        url: "../usdt/subusdt/SubUsdtSelect",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            start: start,
            num: num,
            name: name,
            style: usdt_style,
            examine: examine,
            starttime: starttime,
            endtime: endtime,
            codeid: codeid,
            type: usdt_type
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                sub_usdt = info.usdt;
                for (var i in info.usdt) {
                    var usdt = info.usdt[i];
                    str += "<tr><td><input name=\"checkbox\" type=\"checkbox\" value=\"" + usdt.pid + "\"></td> ";
                    str += "<td><img src=\"" + usdt.sub_img + "\" width=50 height=50 onerror='imgExists(this,0)'/></td>";
                    str += "<td>" + unde(usdt.sub_username) + "</td>";
                    str += "<td>" + usdt.sub_nickname + "</td>";
                    if (usdt.codeid == 31) {
                        str += "<td>USDT</td>";
                    } else {
                        str += "<td>BRU</td>";
                    }
                    str += "<td>" + usdt.money + "</td>";
                    str += "<td>" + undefin(usdt.sub_wallet, usdt.sub_wallet_id) + "</td>";
                    str += "<td>" + format(usdt.createtime, "yy/MM/dd HH:mm:ss") + "</td>";
                    str += " <td>" + undefin(usdt.sys_wallet, info.sys_wallet.wallet) + "</td>";
                    if (usdt.examine == 0) {
                        str += " <td>未审核</td>";
                    } else if (usdt.examine == 1) {
                        str += " <td>审核通过</td>";
                    } else {
                        str += " <td>审核失败</td>";
                    }
                    if (usdt.sys_user_id == 0) {
                        str += " <td>系统</td>";
                    } else {
                        str += " <td>" + unde(usdt.sys_nickname) + "</td>";
                    }

                    str += "<td>" + format(usdt.examine_time, "yy/MM/dd HH:mm:ss") + "</td>";
                    str += " <td>" + unde(usdt.reason) + "</td>";
                    if (usdt.style == 1 || usdt.style == 2) {
                        if (usdt.examine == 0) {
                            str += "<td><button class='btn btn-danger' type='button' onclick='shenhe(\"" + usdt.pid + "\"," + usdt.style + "," + usdt.codeid + ")'>审核</button></td>";
                        } else {
                            str += "<td></td>";
                        }
                    } else {
                        str += "<td></td>";
                    }
                    str += "</tr>";
                }
            } else {
                ajax_code(info.code);
            }
            $("#usdt_center").html(str);
            center_fy("usdt_select", value, page, num, info.count);
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}

usdt_select("", 1);

function class_qh(pid, th, state) {

    if (state == 1) {
        usdt_style = pid;
        $("[name='z-ul-li-A']").removeClass("active");
    } else if (state == 2) {
        examine = pid;
        $("[name='z-ul-li-B']").removeClass("active");
    } else {
        if (pid == 696) {
            codeid = 695;
            usdt_type = 1;
        } else {
            codeid = pid;
            usdt_type = 0;
        }

        $("[name='z-ul-li-C']").removeClass("active");
    }
    $(th).addClass("active");
    usdt_select("", 1);
}

var usdt_pid;
var usdt_style_state;

function shenhe(pid, style, code) {
    usdt_pid = pid;
    usdt_style_state = style;
    usdt_codeid = code;
    $(":text").val("");
    $("#addFile").modal("show");
}

function zt(value) {
    $("#update_reason").hide();
    if (value == 2) {
        $("#update_reason").show();
    }
}

function qd_update() {
    var update_examine = $("#examine").val();
    var reason = $("#reason").val();
    $.ajax({
        type: "post",
        url: "../usdt/subusdt/SubUsdtUpdate",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            state: usdt_style_state,
            pid: usdt_pid,
            examine: update_examine,
            reason: reason,
            codeid: usdt_codeid
        },
        success: function (info) {
            if (info.code == 100) {
                $("#addFile").modal("hide");
                usdt_select("", 1);
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });

}

function undefin(value, tvalue) {
    if (typeof (value) == "undefined") {
        if (typeof (tvalue) == "undefined") {
            return "";
        } else {
            return tvalue;
        }
    } else {
        return value;
    }
}