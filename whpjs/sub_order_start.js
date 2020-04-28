var currency_id;
var minute_id;
var grade_id;
var system_currency;

currency_select();

function currency_select() {
    $.ajax({
        type: "post",
        url: "../usdt/syscurrency/SysCurrency",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                system_currency = info.currency;
                str += "<li class=\"active\" name='z-ul-li-1' onclick='class_qh(\"\",this,1)'><a href=\"javascript:void(0)\">全部币种</a></li>";
                for (var i in info.currency) {
                    var currency = info.currency[i];
                    str += "<li name='z-ul-li-1' onclick='class_qh(\"" + currency.pid + "\",this,1)'><a href=\"javascript:void(0)\">" + currency.name + "</a></li>";
                }
                $("#top-currency").html(str);
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}

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
                str += "<li class=\"active\" name='z-ul-li-2' onclick='class_qh(\"\",this,2)'><a href=\"javascript:void(0)\">全部盘口</a></li>";
                for (var i in info.minute) {
                    var minute = info.minute[i];
                    str += "<li name='z-ul-li-2' onclick='class_qh(\"" + minute.pid + "\",this,2)'><a href=\"javascript:void(0)\">" + minute.name + "</a></li>";
                }
                $("#top-minute").html(str);
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}

var sys_grade;
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
                str += "<li class=\"active\" name='z-ul-li-3' onclick='class_qh(\"\",this,3)'><a href=\"javascript:void(0)\">全部用户等级</a></li>";
                for (var i in info.grade) {
                    var grade = info.grade[i];
                    str += "<li name='z-ul-li-3' onclick='class_qh(\"" + grade.pid + "\",this,3)'><a href=\"javascript:void(0)\">" + grade.name + "</a></li>";
                }
                $("#top-grade").html(str);
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}

order_select("", 1);

function order_select(value, page) {
    var name = $("#user_name").val();
    var num = parseInt(10);
    var start = (parseInt(page) - 1) * num;
    $.ajax({
        type: "post",
        url: "../usdt/suborder/SubOrderSelect",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            isstart: 0,
            sys_minute_id: minute_id,
            sys_currency_id: currency_id,
            name: name,
            sys_grade_id: grade_id,
            start: start,
            num: num
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                for (var i in info.order) {
                    var order = info.order[i];
                    str += "<tr><td><input name=\"checkbox\" type=\"checkbox\" value=\"" + order.pid + "\"></td> ";
                    str += "<td><img src=\"" + order.sub_user_img + "\" width=50 height=50 onerror='imgExists(this,0)'/></td>";
                    str += "<td>" + order.sub_user_username + "</td>";
                    str += "<td>" + order.sub_user_nickname + "</td>";
                    str += "<td>" + order.sys_grade_name + "</td>";
                    var sys_currency_name = "";
                    for (var j in system_currency) {
                        var currency = system_currency[j];
                        if (currency.pid == order.sys_currency_id) {
                            sys_currency_name = currency.name;
                        }
                    }
                    str += "<td>" + sys_currency_name + "</td>";
                    var sys_minute_name = "";
                    for (var j in system_minute) {
                        var minute = system_minute[j];
                        console.info(minute);
                        if (minute.pid == order.sys_minute_id) {
                            console.info(minute.name);
                            sys_minute_name = minute.name;
                        }
                    }
                    str += "<td>" + sys_minute_name + "</td>";
                    str += "<td>" + order.phase + "</td>";
                    str += "<td>" + order.purchase + "</td>";
                    if (order.rise_fall == 0) {
                        str += "<td>涨</td>";
                    } else {
                        str += "<td>跌</td>";
                    }
                    str += "<td>" + order.range + "%</td>";
                    str += "<td>" + format(order.createtime, "yy/MM/dd HH:mm:ss") + "</td> ";

                    if (order.state == 0) {
                        str += " <td><i class=\"fa fa-check success\"></i></td>  ";
                    } else {
                        str += " <td><i class=\"fa fa-times danger\"></i></td>  ";
                    }
                }
                $("#order_center").html(str);
                center_fy("order_select", value, page, num, info.count);
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}

function class_qh(pid, th, state) {
    $("[name='z-ul-li-" + state + "']").removeClass("active");
    $(th).addClass("active");
    if (state == 1) {
        currency_id = pid;
    } else if (state == 2) {
        minute_id = pid
    } else {
        grade_id = pid;
    }
    order_select("", 1);
}