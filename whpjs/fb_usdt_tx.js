var sub_usdt;
var examine;
var codeid;
var usdt_codeid;

function select() {
    $.ajax({
        type: "post",
        url: "../usdt/FbCurrency/FbCurrencySelect",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (info) {
            if (info.code == 100) {
                var str = "";
                for (var i in info.currency) {
                    var currency = info.currency[i];
                    var code_id = code(currency.name);
                    str += "<li name=\"z-ul-li-C\" onclick=\"class_qh(" + code_id + ",this,3)\">";
                    str += "<a href=\"javascript:void(0)\">" + currency.name + "</a>";
                    str += "</li>";
                }
                $("#top-style").append(str);

            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });

}

select();

function usdt_select(value, page) {
    name = $("#user_name").val();
    var num = parseInt(10);
    var start = (parseInt(page) - 1) * num;
    $.ajax({
        type: "post",
        url: "../usdt/FbUsdt/FbUsdtSelect",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            page: start,
            num: num,
            name: name,
            style: 2,
            examine: examine,
            codeid: codeid
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                sub_usdt = info.usdt;
                for (var i in info.usdt) {
                    var usdt = info.usdt[i];
                    str += "<tr><td><input name=\"checkbox\" type=\"checkbox\" value=\"" + usdt.pid + "\"></td> ";
                    str += "<td><img src=\"" + usdt.img + "\" width=50 height=50 onerror='imgExists(this,0)'/></td>";
                    str += "<td>" + usdt.username + "</td>";
                    str += "<td>" + usdt.nickname + "</td>";
                    var currency_name = code_two(usdt.codeid);
                    str += "<td>" + currency_name + "</td>";
                    str += "<td>" + usdt.money + "</td>";
                    str += "<td>" + unde(usdt.from_address) + "</td>";
                    str += "<td>" + format(usdt.createtime, "yy/MM/dd HH:mm:ss") + "</td>";
                    str += " <td>" + unde(usdt.to_address) + "</td>";
                    if (usdt.examine == 0) {
                        str += " <td>未审核</td>";
                    } else if (usdt.examine == 1) {
                        str += " <td>审核通过</td>";
                    } else {
                        str += " <td>审核失败</td>";
                    }
                    str += " <td>" + unde(usdt.sys_nickname) + "</td>";
                    str += "<td>" + format(usdt.examine_time, "yy/MM/dd HH:mm:ss") + "</td>";
                    str += " <td>" + unde(usdt.reason) + "</td>";
                    if (usdt.examine == 0) {
                        str += "<td><button class='btn btn-danger' type='button' onclick='shenhe(\"" + usdt.pid + "\"," + usdt.codeid + ")'>审核</button></td>";
                    } else {
                        str += "<td></td>";
                    }
                    str += "</tr>";
                }
            } else {
                ajax_code(info.code);
            }
            $("#usdt_center").html(str);
            center_fy("user_select", value, page, num, info.total);
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}

usdt_select("", 1);

function class_qh(pid, th, value) {
    if (value == 1) {
        examine = pid;
        $("[name='z-ul-li']").removeClass("active");
        $(th).addClass("active");
    } else {
        codeid = pid;
        $("[name='z-ul-li-C']").removeClass("active");
        $(th).addClass("active");
    }

    usdt_select("", 1);
}

var usdt_pid;

function shenhe(pid, value) {
    usdt_pid = pid;
    usdt_codeid = value;
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
        url: "../usdt/FbUsdt/FbUsdtUpdate",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            state: 2,
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

function code(value) {
    if (value == "BTC") {
        return 1;
    } else if (value == "USDT") {
        return 31;
    } else if (value == "BRU") {
        return 695;
    } else if (value == "ETH") {
        return 1001;
    } else if (value == "ETC") {
        return 2001;
    } else if (value == "BCH") {
        return 3;
    } else if (value == "LTC") {
        return 4;
    }
}

function code_two(value) {
    if (value == 1) {
        return "BTC";
    } else if (value == 31) {
        return "USDT";
    } else if (value == 695) {
        return "BRU";
    } else if (value == 1001) {
        return "ETH";
    } else if (value == 2001) {
        return "ETC";
    } else if (value == 3) {
        return "BCH";
    } else if (value == 4) {
        return "LTC";
    }
}