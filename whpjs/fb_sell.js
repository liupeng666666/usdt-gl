var fb_type;
var currency_id;
var fb_state;
var system_currency;

currency_select();

function currency_select() {
    $.ajax({
        type: "post",
        url: "../usdt/FbCurrency/FbCurrencySelect",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                system_currency = info.currency;
                str += "<li class=\"active\" name='z-ul-li-2' onclick='class_qh(\"\",this,2)'><a href=\"javascript:void(0)\">全部</a></li>";
                for (var i in info.currency) {
                    var currency = info.currency[i];
                    str += "<li name='z-ul-li-2' onclick='class_qh(\"" + currency.pid + "\",this,2)'><a href=\"javascript:void(0)\">" + currency.name + "</a></li>";
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

sell_select("", 1);

function sell_select(value, page) {
    var num = parseInt(10);
    var start = (parseInt(page) - 1) * num;
    $.ajax({
        type: "post",
        url: "../usdt/FbSell/FbSellSelect",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            type: fb_type,
            currencyid: currency_id,
            state: fb_state,
            start: start,
            num: num
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                for (var i in info.sell) {
                    var sell = info.sell[i];
                    str += "<tr><td><input name=\"checkbox\" type=\"checkbox\" value=\"" + sell.pid + "\"></td> ";
                    str += "<td><img src=\"" + sell.img + "\" width=50 height=50 onerror='imgExists(this,0)'/></td>";
                    str += "<td>" + sell.username + "</td>";
                    str += "<td>" + sell.nickname + "</td>";

                    if (sell.type == "1") {
                        str += "<td>售出</td>";
                    } else {
                        str += "<td>购买</td>";
                    }

                    if (sell.style == "1") {
                        str += "<td>正在交易</td>";
                    } else {
                        str += "<td>未交易</td>";
                    }

                    str += "<td>";
                    if (sell.pay_bank == "1") {
                        str += "<a href=\"\"><img src=\"images/zf-1.png\" ></a>";
                    }

                    if (sell.pay_wx == "1") {
                        str += "<a href=\"\"><img src=\"images/zf-2.png\" ></a>";
                    }

                    if (sell.pay_al == "1") {
                        str += "<a href=\"\"><img src=\"images/zf-3.png\" ></a>";
                    }

                    var currency_name = "";
                    for (var j in system_currency) {
                        var currency = system_currency[j];
                        if (currency.pid == sell.fb_currency_id) {
                            currency_name = currency.name;
                        }
                    }

                    str += "</td><td>" + sell.number + " " + currency_name + "</td>";

                    str += "<td>" + sell.min_money + " - " + sell.max_money + " CNY</td>";

                    str += "<td>" + sell.univalent + " CNY</td>";

                    str += "<td>" + format(sell.createtime, "yy/MM/dd HH:mm:ss") + "</td> ";

                    if (sell.state == "0") {
                        str += " <td>上架</td>  ";
                    } else if (sell.state == "1") {
                        str += " <td>下架</td>  ";
                    } else {
                        str += " <td>完成</td>  ";
                    }
                    str += "<td><button class='btn btn-default' type='button' onclick='orderOn(\"" + sell.pid + "\")'>详情</button></td>"
                }
                $("#sell_center").html(str);
                center_fy("sell_select", value, page, num, info.count);
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}

function orderOn(value) {
    fb_sellid = value;
    var url = "fb-order.html";
    load(url);

}

function class_qh(value, th, state) {
    $("[name='z-ul-li-" + state + "']").removeClass("active");
    $(th).addClass("active");
    if (state == 1) {
        fb_type = value;
    } else if (state == 2) {
        currency_id = value
    } else {
        fb_state = value;
    }
    sell_select("", 1);
}

function upd(state) {

    t = check(5);

    if (t != false) {
        upd_state = state;
        if (state == 1) {
            $("#myModalUpdLabel").html("上架");
            $("#myModalUpdLabelN").html("确定要上架商品？");
        } else if (state == 2) {
            $("#myModalUpdLabel").html("下架");
            $("#myModalUpdLabelN").html("确定要下架商品？");
        } else if (state == 3) {
            $("#myModalUpdLabel").html("完成");
            $("#myModalUpdLabelN").html("确定要完成商品？");
        }
        $("#qdupd").attr("onclick", "qd_upd(" + state + ")");
        $("#updFile").modal("show");
    }
}

function qd_upd(state) {

    var upd_state = "";
    if (state == 1) {
        upd_state = "0";
    } else if (state == 2) {
        upd_state = "1";
    } else {
        upd_state = "2";
    }

    $.ajax({
        type: "post",
        url: "../usdt/FbSell/FbSellUpdate",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            pid: t,
            state: upd_state
        },
        success: function (info) {
            if (info.code == 100) {
                sell_select("", 1);
                $("#updFile").modal("hide");
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}