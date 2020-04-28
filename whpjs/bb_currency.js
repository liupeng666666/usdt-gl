var fb_currency;
var system_currency;
// currencyInfo_select();
//
// function currencyInfo_select() {
//     $.ajax({
//         type: "post",
//         url: "../usdt/FbCurrency/FbCurrencySelect",
//         async: true,
//         dataType: "json",
//         beforeSend: function(xhr) {
//             xhr.setRequestHeader('Authorization', token);
//         },
//         success: function(info) {
//             var str = "";
//             if(info.code == 100) {
//                 fb_currency = info.currency;
//                 for(var i in info.currency) {
//                     var currency = info.currency[i];
//                     str += "<tr name='0'><td><input name=\"checkbox\" type=\"checkbox\" value=\"" + currency.pid + "\"></td>";
//                     str += "<td><img src=\"" + currency.img + "\" width=50 height=50 onerror='imgExists(this,3)'></td>";
//                     str += "<td class=\"levels1\">" + currency.name + "</td><td>" + currency.trade_num + "</td><td>" + currency.min_trade + "</td>";
//                     str += "<td>" + currency.max_trade + "</td>";
//                     str += "<td>" + currency.min_qx + "</td>";
//                     str += "<td>" + currency.max_qx + "</td>";
//                     str += "<td>" + currency.trade + "</td>";
//                     str += "<td>" + currency.sort + "位</td>";
//                     if(currency.state == 0) {
//                         str += " <td><i class=\"fa fa-check success\"></i></td>  ";
//                     } else {
//                         str += " <td><i class=\"fa fa-times danger\"></i></td>  ";
//                     }
//                     str += "</tr>";
//                 }
//                 $("#currency_center").html(str);
//             } else {
//                 ajax_code(info.code);
//             }
//         },
//         error: function(err) {
//             ajax_code(500);
//
//         }
//     });
// }

function add() {
    $("#message").html("");
    currency_select();

    $("#qd").attr("onclick", "qd_add()");
    $(":text").val("");
    var str = "";
    for (var i = 1; i < 21; i++) {
        str += "<option value='" + i + "'>第" + i + "位</option>";
    }
    $("#update_currency_req").show();
    $("#update_currency").hide();
    $("#sort").html(str);
    $("#addFile").modal("show");
}

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
                for (var i in info.currency) {
                    var currency = info.currency[i];

                    str += "<option value=\"" + currency.pid + "\">" + currency.name + "</option>";

                    if (i == 0) {
                        $("#currency_img").html("<img id=\"img\" style=\"width:50px;height:50px;\" src=" + currency.cimg + ">");
                    }

                }
                $("#symbol").html(str);
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}

function changeClick() {
    var symbol = $("#symbol").val();

    for (var i in system_currency) {
        var currencyInfo = system_currency[i];
        if (symbol == currencyInfo.pid) {
            $("#currency_img").html("<img id=\"img\" style=\"width:50px;height:50px;\" src=" + currencyInfo.cimg + ">");
        }
    }
}

function qd_add() {

    var pid = $("#symbol").val();
    var img = $("#img").attr("src");
    var name = $("#name").find("option:selected").text();
    var type = $("#type").val();
    var createtime = $("#createtime").val();
    var updatetime = $("#updatetime").val();
    var oneday = $("#oneday").val();
    var market = $("#market").val();
    var open = $("#open").val();
    var sort = $("#sort").val();


    if (name == null || name == "") {
        $("#name").html("名称不能为空！");
        return false;
    }
    if (sort == null || sort == "") {
        $("#message").html("排序不能为空");
        return false;
    }
    if (img == null || img == "") {
        $("#message").html("图片不能为空");
        return false;
    }
    if (type == null || type == "") {
        $("#message").html("不能为空");
        return false;
    }
    if (createtime == null || createtime == "") {
        $("#message").html("创建时间不能为空");
        return false;
    }
    if (updatetime == null || updatetime == "") {
        $("#message").html("修改时间不能为空");
        return false;
    }
    if (oneday == null || oneday == "") {
        $("#message").html("时间不能为空");
        return false;
    }
    if (market == null || market == "") {
        $("#message").html("总市值不能为空");
        return false;
    }
    if (open == null || open == "") {
        $("#message").html("开盘状态不能为空");
        return false;
    }
    if (sort == null || sort == "") {
        $("#message").html("排序不能为空");
        return false;
    }

    $.ajax({
        type: "post",
        url: "../usdt/FbCurrency/FbCurrencyInsert",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            pid: pid,
            name: name,
            type: type,
            img: img,
            sort: sort,
            createtime: createtime,
            updatetime: updatetime,
            oneday: oneday,
            market: market,
            open: open,
            opentime: opentime,
        },

        success: function (info) {
            var str = "";
            if (info.code == 100) {
                currencyInfo_select();
                $("#addFile").modal("hide");
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}

var t = new Array();

/*function update() {
    $("#message").html("");
    t = check(1);
    if(t != false) {
        for(var i in fb_currency) {
            var currency = fb_currency[i];
            if(currency.pid == t[0]) {
                $("#currency").html("<lable class=\"form-control\">"+currency.name+" </lable>");
                $("#currency_img").html("<img id=\"img\" style=\"width:50px;height:50px;\" src="+currency.img+">");
                $("#trade_num").val(currency.trade_num);
                $("#min_trade").val(currency.min_trade);
                $("#max_trade").val(currency.max_trade);
                $("#min_qx").val(currency.min_qx);
                $("#max_qx").val(currency.max_qx);
                $("#trade").val(currency.trade);
                var str = "";
                for(var i = 1; i < 21; i++) {
                    if(currency.sort==i){
                        str += "<option value='" + i + "' selected>第" + i + "位</option>";
                    }else{
                        str += "<option value='" + i + "'>第" + i + "位</option>";
                    }

                }
                $("#sort").html(str);
            }
        }
        $("#update_currency").show();
        $("#update_currency_req").hide();
        $("#qd").attr("onclick", "qd_update()");
        $("#addFile").modal("show");
    }
}*/

/*function qd_update() {

    var trade_num = $("#trade_num").val();
    if (trade_num == null || trade_num == "") {
        $("#message").html("最小交易数量不能为空！");
        return false;
    }else if (isNaN(trade_num)){
        $("#message").html("最小交易数量必须是数值！");
        return false;
    }

    var min_trade = $("#min_trade").val();
    if (min_trade == null || min_trade == "") {
        $("#message").html("最小购买金额不能为空！");
        return false;
    }else if (isNaN(min_trade)){
        $("#message").html("最小购买金额必须是数值！");
        return false;
    }
    var max_trade = $("#max_trade").val();
    if (max_trade == null || max_trade == "") {
        $("#message").html("最大购买金额不能为空！");
        return false;
    }else if (isNaN(max_trade)){
        $("#message").html("最大购买金额必须是数值！");
        return false;
    }
    var min_qx = $("#min_qx").val();
    if (min_qx == null || min_qx == "") {
        $("#message").html("最小提现金额不能为空！");
        return false;
    }else if (isNaN(min_qx)){
        $("#message").html("最小提现金额必须是数值！");
        return false;
    }

    var max_qx = $("#max_qx").val();
    if (max_qx == null || max_qx == "") {
        $("#message").html("最大提现金额不能为空！");
        return false;
    }else if (isNaN(max_qx)){
        $("#message").html("最大提现金额必须是数值！");
        return false;
    }

    var trade = $("#trade").val();
    if (trade == null || trade == "") {
        $("#message").html("手续费不能为空！");
        return false;
    }else if (isNaN(trade)){
        $("#message").html("手续费必须是数值！");
        return false;
    }
    var sort = $("#sort").val();

    $.ajax({
        type: "post",
        url: "../usdt/FbCurrency/FbCurrencyUpdate",
        async: true,
        dataType: "json",
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            pid:t[0],
            trade_num:trade_num,
            min_trade:min_trade,
            max_trade:max_trade,
            sort:sort,
            min_qx:min_qx,
            max_qx:max_qx,
            trade:trade
        },
        success: function(info) {
            var str = "";
            if(info.code == 100) {
                currencyInfo_select();
                $("#addFile").modal("hide");
            } else {
                ajax_code(info.code);
            }
        },
        error: function(err) {
            ajax_code(500);

        }
    });
}*/

/*function del(state) {
    if(state == 1) {
        t = check(3);
    } else if(state == 2) {
        t = check(4);
    } else if(state == 3) {
        t = check(2);
    }

    if(t != false) {
        del_state = state;
        if(state == 1) {
            $("#myModalDelLabel").html("开启");
            $("#myModalDelLabelN").html("确定要开启虚拟币？");
        } else if(state == 2) {
            $("#myModalDelLabel").html("停用");
            $("#myModalDelLabelN").html("确定要停用虚拟币？");
        } else if(state == 3) {
            $("#myModalDelLabel").html("删除");
            $("#myModalDelLabelN").html("确定要删除虚拟币？");
        }
        $("#qddel").attr("onclick", "qd_del(" + state + ")");
        $("#delFile").modal("show");
    }
}*/

/*
function qd_del(state) {
    var isdel = "";
    var z = "";
    if(state == 1) {
        z = "0";
    } else if(state == 2) {
        z = "1";
    } else {
        isdel = "1";
    }

    $.ajax({
        type: "post",
        url: "../usdt/FbCurrency/FbCurrencyDelete",
        async: true,
        dataType: "json",
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            pid: t,
            state: z,
            isdel: isdel
        },
        success: function(info) {
            var str = "";
            if(info.code == 100) {
                currencyInfo_select();
                $("#delFile").modal("hide");
            } else {
                ajax_code(info.code);
            }
        },
        error: function(err) {
            ajax_code(500);

        }
    });
}
*/
