var currency_id;
var minute_id;
var system_currency;
var YanZhengPid = new Array();
currency_select();
var pageTimer = {};
var t_num = 0;

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
                //str += "<li  name='z-ul-li-1' onclick='class_qh(\"\",this,1)'><a href=\"javascript:void(0)\">全部币种</a></li>";
                for (var i in info.currency) {
                    var currency = info.currency[i];
                    if (i == 0) {
                        str += "<li class=\"active\" name='z-ul-li-1' onclick='class_qh(\"" + currency.pid + "\",this,1)'><a href=\"javascript:void(0)\">" + currency.name + "</a></li>";
                        currency_id = currency.pid;
                    } else {
                        str += "<li name='z-ul-li-1' onclick='class_qh(\"" + currency.pid + "\",this,1)'><a href=\"javascript:void(0)\">" + currency.name + "</a></li>";

                    }
                }
                $("#top-currency").html(str);
                minute_select();
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
                //str += "<li  name='z-ul-li-2' onclick='class_qh(\"\",this,2)'><a href=\"javascript:void(0)\">全部盘口</a></li>";
                for (var i in info.minute) {
                    var minute = info.minute[i];
                    if (i == 0) {
                        str += "<li class=\"active\" name='z-ul-li-2' onclick='class_qh(\"" + minute.pid + "\",this,2)'><a href=\"javascript:void(0)\">" + minute.name + "</a></li>";
                        minute_id = minute.pid;
                    } else {
                        str += "<li name='z-ul-li-2' onclick='class_qh(\"" + minute.pid + "\",this,2)'><a href=\"javascript:void(0)\">" + minute.name + "</a></li>";

                    }
                }
                $("#top-minute").html(str);
                order_select();
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}

function order_select() {
    if (t_num > 1) {
        return false;
    }
    for (var i in pageTimer) {
        clearInterval(pageTimer[i]);
    }
    $("#real_center").html("");
    $.ajax({
        type: "post",
        url: "../usdt/suborder/SubOrderSK",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            isstart: 0,
            style: 0,
            sys_currency_id: currency_id,
            sys_minute_id: minute_id
        },
        success: function (info) {

            if (info.code == 100) {
                for (var i in info.order) {
                    var str = "";
                    var order = info.order[i];
                    if (yz(order.pid) == 0) {

                        var currency_name = "";
                        for (var j in system_currency) {
                            var currency = system_currency[j];
                            if (currency.pid == order.sys_currency_id) {
                                currency_name = currency.name;
                            }
                        }
                        var minute_name = "";
                        var minute_minute = 0;
                        for (var j in system_minute) {
                            var minute = system_minute[j];
                            if (minute.pid == order.sys_minute_id) {
                                minute_name = minute.name;
                                minute_minute = minute.minute;
                            }
                        }

                        str += "<li id=" + order.pid + ">";
                        str += "<div>";
                        str += " <a class=\"todo-item\" href=\"javascript:void(0)\"><p style='min-width:200px;float:left'>" + currency_name + "-" + minute_name + "-" + order.phase + "</p><i style='min-width:100px'>倒计时  <span id=\"djs-" + order.pid + "\">" + minute_minute + ":00</span></i></a>";
                        str += " <div style='margin: 20px 0px 0px 50px;'>";
                        str += "	<div>";
                        for (var j in info.order) {
                            var order1 = info.order[j];
                            if (order1.pid == order.pid) {
                                if (order1.rise_fall == 0) {
                                    str += "<p><i class=\"label label-success\">涨</i> 投注：" + order1.range + "%-" + order1.num + "人-" + order1.money + "USDT</p>";

                                }
                            }
                        }
                        str += "</div>";
                        str += " <div>";
                        for (var j in info.order) {
                            var order1 = info.order[j];
                            if (order1.pid == order.pid) {
                                if (order1.rise_fall == 1) {
                                    str += "<p><i class=\"label label-danger\">跌</i> 投注：" + order1.range + "%-" + order1.num + "人-" + order1.money + "USDT</p>";
                                }
                            }
                        }
                        str += " </div>";
                        str += "</div>";
                        str += "</div>";
                        str += " <span class=\"todo-tags pull-right\">";
                        str += " <div class=\"label label-danger\" onclick='kongxian(\"" + order.sys_currency_id + "\",\"" + order.sys_minute_id + "\",\"" + order.phase + "\")'>控线</div>";
                        str += " </span>";
                        str += " </li>";
                        YanZhengPid.push(order.pid);
                        daojishi(order.pid, order.createtime, minute_minute, info.datetime);
                        $("#" + order.pid).remove();
                        $("#real_center").append(str);
                    }
                }
                YanZhengPid = new Array();
                t_num = 0;
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

function yz(pid) {
    var num = parseInt(0);
    for (var i in YanZhengPid) {
        if (pid == YanZhengPid[i]) {
            num = 1;
        }
    }
    return num;
}

function daojishi(id, datetime, fminute, sstime) {
    var date = new Date(datetime);

    var time = date.getTime() + parseInt(fminute) * 60 * 1000;
    var djstime = (parseInt(time) - parseInt(sstime)) / 1000;
    pageTimer[id] = setInterval(function () {

        var hour = Math.floor(djstime / (60 * 60));
        var minute = Math.floor(djstime / 60) - (hour * 60);
        var second = Math.floor(djstime) - (hour * 60 * 60) - (minute * 60);
        var ti = "";
        if (hour == 0) {
            if (minute == 0) {
                ti = second;

            } else {
                ti = minute + ":" + second;
            }
        } else {
            ti = hour + ":" + minute + ":" + second;
        }
        $("#djs-" + id).text(ti);
        if (djstime <= 0 && djstime > -5) {
            $("#djs-" + id).text("正在更新");
            $("#" + id).remove();
            t_num += 1;
            order_select();
            clearInterval(pageTimer[id]);
        } else if (djstime < -5) {
            $("#djs-" + id).text("暂无数据");
            clearInterval(pageTimer[id]);
        }
        djstime -= 1;
    }, 1000);
}

var kx_currency_id;
var kx_minute_id;
var kx_phase;

function kongxian(k_currency_id, k_minute_id, k_phase) {
    kx_currency_id = k_currency_id;
    kx_minute_id = k_minute_id;
    kx_phase = k_phase;
    $("#addFile").modal("show");
}

function qd_kongxian() {
    var rise_fall = $("#rise_fall").val();
    var range = $("#range").val();
    if (range == null || range == '') {
        $("#tip-public-div").html("不能为空");
        $("#tip-public").show();
        return false;
    }
    $.ajax({
        type: "post",
        url: "../usdt/sysmanual/SysManualInsert",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            sys_currency_id: kx_currency_id,
            sys_minute_id: kx_minute_id,
            phase: kx_phase,
            rise_fall: rise_fall,
            range: range
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                order_select();
                $("#addFile").modal("hide");
                if (rise_fall == 0) {
                    $("#tip-public-div").html("当前控线 涨幅：" + range + "%");
                } else {
                    $("#tip-public-div").html("当前控线 跌幅：" + range + "%");
                }

                $("#tip-public").show();
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}