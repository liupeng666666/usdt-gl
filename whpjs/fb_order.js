var fb_type;
var fb_state;

order_select("", 1);

function order_select(value, page) {

    var fb_selInfo = $("#user_name").val();
    var num = parseInt(10);
    var start = (parseInt(page) - 1) * num;
    $.ajax({
        type: "post",
        url: "../usdt/FbOrder/FbOrderSelect",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            sellid: fb_sellid,
            type: fb_type,
            selInfo: fb_selInfo,
            start: start,
            num: num,
            state: fb_state
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                for (var i in info.order) {
                    var order = info.order[i];
                    str += "<tr><td>" + order.id + "</td>";
                    str += "<td>" + order.username + "</td>";
                    str += "<td>" + order.fusername + "</td>";
                    str += "<td>" + order.number + "</td>";
                    str += "<td>" + order.money + "</td>";
                    str += "<td>" + order.univalent + "</td>";

                    if (order.state == "0") {
                        str += "<td>已拍下</td>";
                    } else if (order.state == "1") {
                        str += "<td>已付款</td>";
                    } else if (order.state == "2") {
                        str += "<td>已收款</td>";
                    } else if (order.state == "3") {
                        str += "<td>已放币</td>";
                    } else if (order.state == "5") {
                        str += "<td>卖方取消</td>";
                    } else if (order.state == "6") {
                        str += "<td>买方取消</td>";
                    } else if (order.state == "7") {
                        str += "<td>已完成</td>";
                    } else if (order.state == "8") {
                        str += "<td>卖方已评价，买方未评价</td>";
                    } else if (order.state == "9") {
                        str += "<td>买方已评价，卖方未评价</td>";
                    }

                    if (order.type == "0") {
                        str += "<td>卖币</td>";
                    } else {
                        str += "<td>买币</td>";
                    }

                    str += "<td>" + format(order.createtime, "yy/MM/dd HH:mm:ss") + "</td> ";
                    str += "<td>" + format(order.updatetime, "yy/MM/dd HH:mm:ss") + "</td>";
                    str += "<td><button class='btn btn-default' type='button' onclick='orderState(\"" + order.pid + "\", \"" + order.id + "\")'>记录</button></td>";
                    str += "<td><button class='btn btn-default' type='button' onclick='message(\"" +
                        order.userid + "\", \"" + order.fuserid + "\", \"" + format(order.createtime, "----") + "\", \"" + format(order.updatetime, "----") + "\", \"" + order.id + "\")'>记录</button></td>"

                    if ((order.type == "0" && order.state == "5" && order.style == 0) || (order.type == "1" && order.state == "5" && order.style == 0)) {
                        str += "<td><button class='btn btn-default' type='button' onclick='update(\"" + order.pid + "\",\"" + order.type + "\")'>解决</button></td></tr>";
                    } else {
                        str += "<td></td></tr>";
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
    fb_sellid = null;
}

function class_qh(value, th) {
    $("[name='z-ul-li-1']").removeClass("active");
    $(th).addClass("active");

    fb_type = value;
    order_select("", 1);
}

function class_qh_state(value, th) {
    $("[name='z-ul-li-2']").removeClass("active");
    $(th).addClass("active");

    fb_state = value;
    order_select("", 1);
}

function orderState(value, orderVal) {
    $(":text").val("");

    $.ajax({
        type: "post",
        url: "../usdt/FbOrder/FbOrderStateSelect",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            orderid: value
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                for (var i in info.orderState) {
                    var orderInfo = info.orderState[i];
                    str += "<tr><td>" + orderVal + "</td>";

                    if (orderInfo.type == "0") {
                        str += "<td>卖币</td>";
                    } else {
                        str += "<td>买币</td>";
                    }

                    str += "<td>" + format(orderInfo.createtime, "yy/MM/dd HH:mm:ss") + "</td> ";

                    if (orderInfo.state == "0") {
                        str += "<td>已拍下</td>";
                    } else if (orderInfo.state == "1") {
                        str += "<td>已付款</td>";
                    } else if (orderInfo.state == "2") {
                        str += "<td>已收款</td>";
                    } else if (orderInfo.state == "3") {
                        str += "<td>已放币</td>";
                    } else if (orderInfo.state == "5") {
                        str += "<td>卖方取消</td>";
                    } else if (orderInfo.state == "6") {
                        str += "<td>买方取消</td>";
                    } else if (orderInfo.state == "7") {
                        str += "<td>已完成</td>";
                    } else if (orderInfo.state == "8") {
                        str += "<td>卖方已评价，买方未评价</td>";
                    } else if (orderInfo.state == "9") {
                        str += "<td>买方已评价，卖方未评价</td>";
                    }
                }

                $("#state_center").html(str);
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });

    $("#stateInfo").modal("show");
}

function message(fb_userid, fb_fuserid, fb_createtime, fb_updatetime, orderid) {
    $(":text").val("");

    $.ajax({
        type: "post",
        url: "../usdt/FbOrder/FbOrderMsgSelect",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            userid: fb_userid,
            fuserid: fb_fuserid,
            orderid: orderid
        },
        success: function (info) {
            var str = "";
            var user_from = "";
            if (info.code == 100) {
                for (var i in info.orderMsg) {
                    var msgInfo = info.orderMsg[i];

                    if (i == 0) {
                        user_from = msgInfo.msg_from;
                    }
                    var json = JSON.parse(msgInfo.message);
                    if (user_from == msgInfo.msg_from) {
                        str += "<tr><td style=\"border:0px\"><img src=\"" + msgInfo.img_from + "\" width=50 height=50 onerror='imgExists(this,0)'/></td>";
                        if (json.state == 0) {
                            str += "<td style=\"border:0px\"><p style='font-size:10px'>" + msgInfo.createtime + "</p>" + json.message + "</td>";
                        } else {
                            str += "<td style=\"border:0px\"><p style='font-size:10px'>" + msgInfo.createtime + "</p><img src=\"" + json.message + "\"></td>";
                        }

                        str += "<td style=\"border:0px\"></td></tr>";
                    } else {
                        str += "<tr><td style=\"border:0px\"></td>";
                        if (json.state == 0) {
                            str += "<td align=\"right\" style=\"border:0px\"><p style='font-size:10px'>" + msgInfo.createtime + "</p>" + json.message + "</td>";
                        } else {
                            str += "<td align=\"right\" style=\"border:0px\"><p style='font-size:10px'>" + msgInfo.createtime + "</p><img src=\"" + json.message + "\"></td>";
                        }
                        str += "<td style=\"border:0px\"><img src=\"" + msgInfo.img_from + "\" width=50 height=50 onerror='imgExists(this,0)'/></td></tr>";
                    }
                }

                $("#msg_center").html(str);
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });

    $("#msgInfo").modal("show");
}

function orderState(value, orderVal) {
    $(":text").val("");

    $.ajax({
        type: "post",
        url: "../usdt/FbOrder/FbOrderStateSelect",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            orderid: value
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                for (var i in info.orderState) {
                    var orderInfo = info.orderState[i];
                    str += "<tr><td>" + orderVal + "</td>";

                    if (orderInfo.type == "0") {
                        str += "<td>卖币</td>";
                    } else {
                        str += "<td>买币</td>";
                    }

                    str += "<td>" + format(orderInfo.createtime, "yy/MM/dd HH:mm:ss") + "</td> ";

                    if (orderInfo.state == "0") {
                        str += "<td>已拍下</td>";
                    } else if (orderInfo.state == "1") {
                        str += "<td>已付款</td>";
                    } else if (orderInfo.state == "2") {
                        str += "<td>已收款</td>";
                    } else if (orderInfo.state == "3") {
                        str += "<td>已放币</td>";
                    } else if (orderInfo.state == "5") {
                        str += "<td>卖方取消</td>";
                    } else if (orderInfo.state == "6") {
                        str += "<td>买方取消</td>";
                    } else if (orderInfo.state == "7") {
                        str += "<td>已完成</td>";
                    } else if (orderInfo.state == "8") {
                        str += "<td>卖方已评价，买方未评价</td>";
                    } else if (orderInfo.state == "9") {
                        str += "<td>买方已评价，卖方未评价</td>";
                    }
                }

                $("#state_center").html(str);
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });

    $("#stateInfo").modal("show");
}

var t = new Array();
var str = "";

function update(value, type) {

    $("#qdUpd").attr("onclick", "qd_update(\"" + value + "\",\"" + type + "\")");
    $("#qdCel").attr("onclick", "qd_cancel(\"" + value + "\",\"" + type + "\")");
    $("#orderUpdateInfo").modal("show");

}

function qd_update(value, type) {

    $.ajax({
        type: "post",
        url: "../usdt/FbOrder/FbOrderInfoUpdate",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            pid: value,
            type: type
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                order_select("", 1);
                $("#orderUpdateInfo").modal("hide");
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });

}

function qd_cancel(value, type) {

    $.ajax({
        type: "post",
        url: "../usdt/FbOrder/FbOrderInfoCancel",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            pid: value,
            type: type
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                order_select("", 1);
                $("#orderUpdateInfo").modal("hide");
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });

}

