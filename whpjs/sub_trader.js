var mc = "money";
var name = "";
user_select("", 1);

function user_select(value, page) {
    name = $("#user_name").val();
    var num = parseInt(10);
    var start = (parseInt(page) - 1) * num;
    $.ajax({
        type: "post",
        url: "../usdt/subuser/SubUserMoneySelect",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            start: start,
            num: num,
            name: name,
            mc: mc,
            state: ""
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                for (var i in info.user) {
                    var user = info.user[i];
                    str += "<tr><td><input name=\"checkbox\" type=\"checkbox\" value=\"" + user.pid + "\"></td> ";
                    str += "<td><img src=\"" + user.img + "\" width=50 height=50 onerror='imgExists(this,0)'/></td>";
                    str += "<td>" + user.username + "</td>";
                    str += "<td>" + user.phone + "</td>";
                    str += "<td>" + user.email + "</td>";
                    str += "<td>" + user.nickname + "</td>";
                    str += "<td>" + user.money + "</td>";
                    str += "<td>" + user.surplus + "</td>";
                    str += "<td>" + user.trade + "</td>";
                    str += "<td>" + user.income + "</td>";
                    str += "<td>" + user.loss + "</td>";
                    str += "<td>" + user.trade_income + "</td>";
                    str += "<td>" + format(user.money_updatetime, "yy/MM/dd HH:mm:ss") + "</td> ";
                    if (user.state == 0) {
                        str += " <td><i class=\"fa fa-check success\"></i></td>  ";
                    } else {
                        str += " <td><i class=\"fa fa-times danger\"></i></td>  ";
                    }
                    str += "</tr>";
                }
                $("#user_center").html(str);
                center_fy("user_select", value, page, num, info.count);
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}

function paixu(value, th) {
    mc = value;
    $("button[name='top-button']").attr("class", "btn btn-primary");
    $(th).attr("class", "btn btn-success");
    user_select("", 1);
}
