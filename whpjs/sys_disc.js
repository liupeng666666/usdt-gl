var currency_id;
var minute_id;
var system_currency;
var YanZhengPid = new Array();
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

order_select("", 1);

function order_select(value, page) {
    var starttime = $("#datetimepicker").val();
    var endtime = $("#datetimepicker2").val();
    var num = parseInt(10);
    var start = (parseInt(page) - 1) * num;
    $.ajax({
        type: "post",
        url: "../usdt/sysdisc/SysDiscSelect",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            sys_minute_id: minute_id,
            sys_currency_id: currency_id,
            isstart: 1,
            start: start,
            num: num,
            starttime: starttime,
            endtime: endtime
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                for (var i in info.disc) {

                    var disc = info.disc[i];
                    var currency_name = "";
                    for (var j in system_currency) {
                        var currency = system_currency[j];
                        if (currency.pid == disc.sys_currency_id) {
                            currency_name = currency.name;
                        }
                    }
                    var minute_name = "";
                    var minute_minute = 0;
                    for (var j in system_minute) {
                        var minute = system_minute[j];
                        if (minute.pid == disc.sys_minute_id) {
                            minute_name = minute.name;
                            minute_minute = minute.minute;
                        }
                    }

                    str += "<li id=" + disc.pid + ">";
                    str += " <a class=\"todo-item\" href=\"javascript:void(0)\">" + currency_name + "-" + minute_name + "-" + disc.phase + "</a>";
                    str += "<div><table class=\"table table-hover table-striped table-bordered\"><thead><tr>";
                    str += "<th>开盘价</th>";
                    str += "<th>收盘价</th>";
                    str += "<th>最高价</th>";
                    str += "<th>最低价</th>";
                    str += "<th>购买人次</th>";
                    str += "<th>总购买金额</th>";
                    str += "<th>买涨人数</th>";
                    str += "<th>买涨金额</th>";
                    str += "<th>买跌人数</th>";
                    str += "<th>买跌金额</th>";
                    str += "</tr></thead><tbody>";
                    str += "<td>" + disc.open + "</td>";
                    str += "<td>" + disc.close + "</td>";
                    str += "<td>" + disc.high + "</td>";
                    str += "<td>" + disc.low + "</td>";
                    var zrs = parseInt(0);
                    var zje = parseFloat(0);
                    var mzrs = parseInt(0);
                    var mzje = parseFloat(0);
                    var mdrs = parseInt(0);
                    var mdje = parseFloat(0);
                    for (var j in disc.order) {
                        var order = disc.order[j];
                        zrs += parseInt(order.num);
                        zje += parseFloat(order.money);
                        if (order.rise_fall == 0) {
                            mzrs += parseInt(order.num);
                            mzje += parseFloat(order.money);
                        } else {
                            mdrs += parseInt(order.num);
                            mdje += parseFloat(order.money);
                        }
                    }
                    str += "<td>" + zrs + "</td>";
                    str += "<td>" + zje + "</td>";
                    str += "<td>" + mzrs + "</td>";
                    str += "<td>" + mzje + "</td>";
                    str += "<td>" + mdrs + "</td>";
                    str += "<td>" + mdje + "</td>";
                    str += "</tr></tbody></table>";
                    str += "</div>";
                    str += " <div>";
                    str += "	<div style=\"float: left; width: 50%;\">";
                    for (var j in disc.order) {
                        var order1 = disc.order[j];
                        if (order1.rise_fall == 0) {
                            str += "<p><i class=\"label label-danger\">涨</i> 投注：" + order1.range + "%-" + order1.num + "人-" + order1.money + "USDT</p>";
                        }
                    }
                    str += "</div>";
                    str += " <div>";
                    for (var j in disc.order) {
                        var order1 = disc.order[j];
                        if (order1.rise_fall == 1) {
                            str += "<p><i class=\"label label-success\">跌</i> 投注：" + order1.range + "%-" + order1.num + "人-" + order1.money + "USDT</p>";
                        }
                    }
                    str += " </div>";
                    str += "</div>";

                    str += " <span class=\"todo-tags pull-right\">";
                    str += " <div class=\"label label-info\">" + format(disc.createtime, "yy/MM/dd HH:mm:ss") + "-" + format(disc.endtime, "yy/MM/dd HH:mm:ss") + "</div>";
                    str += " </span>";
                    str += " </li>";
                }
                center_fy("order_select", "", page, num, info.count);
                $("#disc_center").html(str);

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

