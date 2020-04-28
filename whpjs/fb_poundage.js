var fb_poundage;
poundageInfo_select();

function poundageInfo_select() {
    $.ajax({
        type: "post",
        url: "../usdt/FbPoundage/FbPoundageSelect",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                fb_poundage = info.poundageList;
                for (var i in info.poundageList) {
                    var poundage = info.poundageList[i];
                    str += "<tr name='0'><td><input name=\"checkbox\" type=\"checkbox\" value=\"" + poundage.pid + "\"></td>";
                    str += "<td>" + poundage.name + "</td>";
                    str += "<td>" + poundage.poundage + "%</td>";
                    if (poundage.type == '0') {
                        str += " <td>购买</td>  ";
                    } else {
                        str += " <td>出售</td>  ";
                    }
                    str += "<td>" + format(poundage.createtime, "yy/MM/dd HH:mm:ss") + "</td>";
                    str += "<td>" + format(poundage.updatetime, "yy/MM/dd HH:mm:ss") + "</td>";
                    str += "</tr>";
                }
                $("#poundage_center").html(str);
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

function update() {
    $("#message").html("");
    t = check(1);
    if (t != false) {
        for (var i in fb_poundage) {
            var poundage = fb_poundage[i];
            if (poundage.pid == t[0]) {
                $("#currencyid").html("<lable class=\"form-control\">" + poundage.name + " </lable>");
                if (poundage.type == '0') {
                    $("#type").html("<lable class=\"form-control\">购买</lable>");
                } else {
                    $("#type").html("<lable class=\"form-control\">出售</lable>");
                }
                $("#poundage_id").val(poundage.poundage);
            }
        }

        $("#qd").attr("onclick", "qd_update()");
        $("#addFile").modal("show");
    }
}

function qd_update() {

    var poundage_id = $("#poundage_id").val();
    if (poundage_id == null || poundage_id == "") {
        $("#message").html("手续费不能为空！");
        return false;
    }

    if (poundage_id < 0 || poundage_id > 100) {
        $("#message").html("手续费请入力0和100之间的值！");
        return false;
    }

    $.ajax({
        type: "post",
        url: "../usdt/FbPoundage/FbPoundageUpdate",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            pid: t[0],
            poundage: poundage_id
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                poundageInfo_select();
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
