var system_category;
category_select();

function category_select() {
    $.ajax({
        type: "post",
        url: "../usdt/sysclass/SysClass",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (info) {
            var str = "";
            var str1 = "";
            if (info.code == 100) {
                system_category = info.class;
                str += "<tr><td></td>";
                str += "<td class=\"levels1\" onclick='display(\"0\")'><i class=\"icon-tree icon-tree-open\" id='x0'></i>新闻分类</td><td>News classification</td></tr>";
                str1 += "<tr><td></td>";
                str1 += "<td class=\"levels1\" onclick='display(\"1\")'><i class=\"icon-tree icon-tree-open\" id='x1'></i>公告分类</td><td>Bulletin classification</td></tr>";
                for (var i in info.class) {
                    var sys_class = info.class[i];
                    if (sys_class.style == 0) {
                        str += "<tr name='0'><td><input name=\"checkbox\" type=\"checkbox\" value=\"" + sys_class.pid + "\"></td>";
                        str += "<td class=\"levels2\"><i class=\"icon-tree\" id='x0'></i>" + sys_class.name + "</td><td>" + unde(sys_class.y_name) + "</td></tr>";
                    }
                    if (sys_class.style == 1) {
                        str1 += "<tr name='1'><td><input name=\"checkbox\" type=\"checkbox\" value=\"" + sys_class.pid + "\"></td>";
                        str1 += "<td class=\"levels2\"><i class=\"icon-tree\" id='x1'></i>" + sys_class.name + "</td><td>" + unde(sys_class.y_name) + "</td></tr>";
                    }
                }
                str += str1;
                $("#category_center").html(str);
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}


function display(departmentcode) {
    var cl = $("#x" + departmentcode).attr("class");
    if (cl == "icon-tree icon-tree-open") {
        $("[name='" + departmentcode + "']").hide();
        $("#x" + departmentcode).attr("class", "icon-tree icon-tree-close");
    } else {
        $("[name='" + departmentcode + "']").show();
        $("#x" + departmentcode).attr("class", "icon-tree icon-tree-open");
    }
}

function add() {
    $(":text").val("");
    $("#qd").attr("onclick", "qd_add()");
    $("#addFile").modal("show");
}

function qd_add() {
    var styleid = $("#style").val();
    var name = $("#name").val();
    var y_name = $("#y_name").val();
    console.info(name);
    $.ajax({
        type: "post",
        url: "../usdt/sysclass/SysClassInsert",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {style: styleid, name: name, y_name: y_name},
        success: function (info) {
            if (info.code == 100) {
                category_select();
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

function update() {
    t = check(1);
    if (t != false) {
        for (var i in system_category) {
            var category = system_category[i];
            if (category.pid == t[0]) {
                $("#style option[value='" + category.style + "']").attr("selected", "selected");
                $("#name").val(category.name);
                $("#y_name").val(category.y_name);
            }
        }
        $("#qd").attr("onclick", "qd_update()");
        $("#addFile").modal("show");
    }

}

function qd_update() {
    var styleid = $("#style").val();
    var name = $("#name").val();
    var y_name = $("#y_name").val();
    $.ajax({
        type: "post",
        url: "../usdt/sysclass/SysClassUpdate",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {style: styleid, name: name, pid: t[0], y_name: y_name},
        success: function (info) {
            if (info.code == 100) {
                category_select();
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

function del() {
    t = check(2);
    if (t != false) {
        $("#delFile").modal("show");
    }
}

function qd_del() {
    $.ajax({
        type: "post",
        url: "../usdt/sysclass/SysClassDel",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {isdel: 1, pid: t},
        success: function (info) {
            if (info.code == 100) {
                category_select();
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
