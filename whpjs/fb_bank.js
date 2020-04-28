var fb_bank;
bankInfo_select();

function bankInfo_select() {
    $.ajax({
        type: "post",
        url: "../usdt/FbBank/FbBankSelect",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                fb_bank = info.bank;
                for (var i in info.bank) {
                    var bank = info.bank[i];
                    str += "<tr name='0'><td><input name=\"checkbox\" type=\"checkbox\" value=\"" + bank.pid + "\"></td>";
                    str += "<td class=\"levels1\">" + bank.name + "</td>";
                    if (bank.state == 0) {
                        str += " <td><i class=\"fa fa-check success\"></i></td>  ";
                    } else {
                        str += " <td><i class=\"fa fa-times danger\"></i></td>  ";
                    }
                    str += "</tr>";
                }
                $("#bank_center").html(str);
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}

function add() {
    $("#message").html("");
    $(":text").val("");
    $("#qd").attr("onclick", "qd_add()");
    $("#addFile").modal("show");
}

function qd_add() {
    var bank_name = $("#bank_name").val();
    if (bank_name == null || bank_name == "") {
        $("#message").html("银行名称不能为空！");
        return false;
    }

    $.ajax({
        type: "post",
        url: "../usdt/FbBank/FbBankInsert",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            name: bank_name
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                bankInfo_select();
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

function update() {
    $("#message").html("");
    t = check(1);
    if (t != false) {
        for (var i in fb_bank) {
            var bank = fb_bank[i];
            if (bank.pid == t[0]) {
                $("#bank_name").val(bank.name);
            }
        }

        $("#qd").attr("onclick", "qd_update()");
        $("#addFile").modal("show");
    }
}

function qd_update() {

    var bank_name = $("#bank_name").val();
    if (bank_name == null || bank_name == "") {
        $("#message").html("银行名称不能为空！");
        return false;
    }

    $.ajax({
        type: "post",
        url: "../usdt/FbBank/FbBankUpdate",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            pid: t[0],
            name: bank_name
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                bankInfo_select();
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

function del(state) {
    if (state == 1) {
        t = check(3);
    } else if (state == 2) {
        t = check(4);
    } else if (state == 3) {
        t = check(2);
    }

    if (t != false) {
        del_state = state;
        if (state == 1) {
            $("#myModalDelLabel").html("开启");
            $("#myModalDelLabelN").html("确定要开启银行？");
        } else if (state == 2) {
            $("#myModalDelLabel").html("停用");
            $("#myModalDelLabelN").html("确定要停用银行？");
        } else if (state == 3) {
            $("#myModalDelLabel").html("删除");
            $("#myModalDelLabelN").html("确定要删除银行？");
        }
        $("#qddel").attr("onclick", "qd_del(" + state + ")");
        $("#delFile").modal("show");
    }
}

function qd_del(state) {
    var isdel = "";
    var z = "";
    if (state == 1) {
        z = "0";
    } else if (state == 2) {
        z = "1";
    } else {
        isdel = "1";
    }

    $.ajax({
        type: "post",
        url: "../usdt/FbBank/FbBankDelete",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            pid: t,
            state: z,
            isdel: isdel
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                bankInfo_select();
                $("#delFile").modal("hide");
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}
