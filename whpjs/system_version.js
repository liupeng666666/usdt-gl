system_select();

function system_select() {
    $.ajax({
        type: "post",
        url: "../usdt/subversion/SysVersionSelect",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {

                for (var i in info.list) {
                    var list = info.list[i];

                    str += "<tr><td><input name=\"checkbox\" type=\"checkbox\" value=\"" + list.pid + "\"></td> ";
                    if (list.type == 1) {
                        str += "<td>andriod</td>";
                    } else {
                        str += "<td>IOS</td>";
                    }
                    str += "<td>" + list.version + "</td>";
                    str += "<td>" + list.memo + "</td>";
                    if (list.style == 0) {
                        str += "<td>不强制</td>";
                    } else {
                        str += "<td>强制</td>";
                    }
                    str += "<td>" + list.time + "</td>";
                    str += "<td>" + list.savepath + "</td>";
                    str += "</tr>";
                }


                $("#sys_center").html(str);
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    })

}

function qd_add() {
    var version = $("#version").val();
    var type = $("#type").val();
    var memo = $("#memo").val();
    var style = $("#style").val();
    var savepath = $("#savepath").val();
    $.ajax({
        type: "post",
        url: "../usdt/subversion/SysVersionInsert",
        async: true,
        dataType: "json",
        data: {
            version: version,
            type: type,
            memo: memo,
            style: style,
            savepath: savepath
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (info) {
            if (info.code == 100) {
                system_select();
                $("#addFile").modal("hide");
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    })

}

function update() {

    $("#addFile").modal("show");
}
