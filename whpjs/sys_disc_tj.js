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
                //ajax_code(info.code);
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
                //ajax_code(info.code);
            }
        },
        error: function (err) { //ajax_code(500);

        }
    });
}

order_select();

function order_select() {
    var starttime = $("#datetimepicker").val();
    var endtime = $("#datetimepicker2").val();
    $.ajax({
        type: "post",
        url: "../usdt/sysdisc/SysDiscSelectTj",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            sys_minute_id: minute_id,
            sys_currency_id: currency_id,
            starttime: starttime,
            endtime: endtime
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                for (var i in info.disc) {

                    var disc = info.disc[i];
                    str += "<li>";
                    str += " <a class=\"todo-item\" href=\"javascript:void(0)\">" + disc.date + "</a>";
                    str += "<div><table class=\"table table-hover table-striped table-bordered\"><thead><tr>";
                    str += "<th>币种</th>";
                    str += "<th>盘口</th>";
                    str += "<th>买涨人数</th>";
                    str += "<th>买涨金额</th>";
                    str += "<th>买涨收益</th>";
                    str += "<th>买跌人数</th>";
                    str += "<th>买跌金额</th>";
                    str += "<th>买跌收益</th>";
                    str += "</tr></thead><tbody>";
                    var ces = new Array();
                    var z_money = 0;
                    var z_income = 0;
                    var z_num = 0;
                    for (var j in disc.sj) {
                        var sj = disc.sj[j];
                        var mz_num = 0;
                        var mz_money = 0;
                        var mz_income = 0;
                        var md_num = 0;
                        var md_money = 0;
                        var md_income = 0;
                        if ($.inArray(sj.sys_currency_id + "." + sj.sys_minute_id, ces) == -1) {
                            if (sj.rise_fall == "0") {
                                mz_num = sj.num;
                                mz_money = sj.purchase;
                                mz_income = sj.income;
                                for (var s in disc.sj) {
                                    var sjs = disc.sj[s];
                                    if (sjs.sys_currency_id == sj.sys_currency_id && sjs.sys_minute_id == sj.sys_minute_id && sj.rise_fall != sjs.rise_fall && sj.date == sjs.date) {
                                        md_num = sjs.num;
                                        md_money = sjs.purchase;
                                        md_income = sjs.income;
                                    }
                                }
                            } else {
                                md_num = sj.num;
                                md_money = sj.purchase;
                                md_income = sj.income;
                                for (var s in disc.sj) {
                                    var sjs = disc.sj[s];
                                    if (sjs.sys_currency_id == sj.sys_currency_id && sjs.sys_minute_id == sj.sys_minute_id && sj.rise_fall != sjs.rise_fall && sj.date == sjs.date) {
                                        mz_num = sjs.num;
                                        mz_money = sjs.purchase;
                                        mz_income = sjs.income;
                                    }
                                }
                            }

                            ces.push(sj.sys_currency_id + "." + sj.sys_minute_id);

                            var currency_name = "";
                            for (var j in system_currency) {
                                var currency = system_currency[j];
                                if (currency.pid == sj.sys_currency_id) {
                                    currency_name = currency.name;
                                }
                            }
                            var minute_name = "";
                            var minute_minute = 0;
                            for (var j in system_minute) {
                                var minute = system_minute[j];
                                if (minute.pid == sj.sys_minute_id) {
                                    minute_name = minute.name;
                                    minute_minute = minute.minute;
                                }
                            }
                            z_money += mz_money + md_money;
                            z_income += mz_income + md_income;
                            z_num += mz_num + md_num;
                            str += "<tr><td>" + currency_name + "</td>";
                            str += "<td>" + minute_name + "</td>";
                            str += "<td>" + mz_num + "</td>";
                            str += "<td>" + mz_money + "</td>";
                            str += "<td>" + mz_income + "</td>";
                            str += "<td>" + md_num + "</td>";
                            str += "<td>" + md_money + "</td>";
                            str += "<td>" + md_income + "</td>";
                            str += "</tr>";
                        }

                    }

                    str += "</tbody></table>";
                    str += "</div>";
                    str += " <div>";
                    str += " <span class=\"todo-tags pull-right\">";
                    str += " <div class=\"label label-info\">投注人数：" + z_num + "人，共投入：" + z_money + "，盈利/亏损：" + z_income + "</div>";
                    str += " </span>";
                    str += " </li>";
                }
                $("#disc_center").html(str);

            } else {
                //ajax_code(info.code);
            }
        },
        error: function (err) { //ajax_code(500);

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
    order_select();
}