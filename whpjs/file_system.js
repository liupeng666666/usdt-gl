var system_part;
system_select();

function system_select() {
    $.ajax({
        type: "get",
        url: "../usdt/sysdepartment/getDepartmentByParent?parentdepartmentcode=" + index_user.departmentcode,
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                system_part = info.part;
                for (var i in info.part) {
                    var part = info.part[i];
                    str += "<tr name='" + part.parentdepartmentcode + "'>";
                    str += "<td><input name=\"checkbox\" type=\"checkbox\" value=\"" + part.departmentcode + "\"></td>       ";
                    str += " <td class=\"levels" + part.level + " has-child\" onclick='display(\"" + part.departmentcode + "\")'><i class=\"icon-tree icon-tree-open\" id='i" + part.departmentcode + "'></i>" + part.departmentname + "</td>";
                    if (typeof (part.memo) == "undefined") {
                        str += "<td></td>";
                    } else {
                        str += "<td>" + part.memo + "</td>";
                    }

                    str += "</tr>  ";
                }
                $("#system_center").html(str);
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
    var cl = $("#i" + departmentcode).attr("class");
    if (cl == "icon-tree icon-tree-open") {
        $("[name='" + departmentcode + "']").hide();
        $("#i" + departmentcode).attr("class", "icon-tree icon-tree-close");
    } else {
        $("[name='" + departmentcode + "']").show();
        $("#i" + departmentcode).attr("class", "icon-tree icon-tree-open");
    }
}

function add() {
    $("#add_tishi").html("");
    $(":text").val("");
    $("textarea").val("");
    var str = "<option value='" + index_user.departmentcode + "'>父级</option>";
    for (var i in system_part) {
        str += "<option value='" + system_part[i].departmentcode + "'>" + system_part[i].departmentname + "</option>";
    }
    $("#add_select").html(str);
    $("#addFile").modal("show");
    $("#qd").attr("onclick", "qd_add()");
}

function qd_add() {
    if ($("#add_departmentname").val() == "") {
        $("#add_tishi").html("部门不能为空");
        return false;
    }
    var date = $("#add_from").serialize();

    $.ajax({
        type: "post",
        url: "../usdt/sysdepartment/addDepartment",
        async: true,
        dataType: "json",
        data: date,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (info) {
            if (info.code == 100) {
                $("#addFile").modal("hide");
                system_select();
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
    t = check(1);
    if (t != false) {
        var str = "<option value='" + index_user.departmentcode + "'>父级</option>";
        for (var i in system_part) {
            if (system_part[i].departmentcode == t[0]) {
                $("#add_departmentname").val(system_part[i].departmentname);
                $("#add_memo").val(system_part[i].memo);

                for (var j in system_part) {
                    if (system_part[i].parentdepartmentcode == system_part[j].departmentcode) {
                        str += "<option value='" + system_part[j].departmentcode + "' selected>" + system_part[j].departmentname + "</option>";

                    } else {
                        str += "<option value='" + system_part[j].departmentcode + "'>" + system_part[j].departmentname + "</option>";

                    }
                }
            }
        }
        $("#add_select").html(str);
        $("#addFile").modal("show");
        $("#qd").attr("onclick", "qd_update()");
    }
}

function qd_update() {
    if ($("#add_departmentname").val() == "") {
        $("#add_tishi").html("部门不能为空");
        return false;
    }
    var date = $("#add_from").serialize();
    date = date + "&departmentcode=" + t[0];
    $.ajax({
        type: "post",
        url: "../usdt/sysdepartment/updateDepartment",
        async: true,
        dataType: "json",
        data: date,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (info) {
            if (info.code == 100) {
                $("#addFile").modal("hide");
                system_select();
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
        url: "../usdt/sysdepartment/delDepartment",
        async: true,
        dataType: "json",
        data: {
            departmentcode: t
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (info) {
            if (info.code == 100) {
                $("#delFile").modal("hide");
                system_select();
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}

function qx() {
    t = check(1);
    if (t != false) {
        $.ajax({
            type: "post",
            url: "../usdt/sysmodule/getModuleByUserP",
            async: true,
            dataType: "json",
            data: {
                departmentcode: t[0]
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', token);
            },
            success: function (info) {
                var str = "[";
                if (info.usermodule.code == 100) {
                    for (var i in info.usermodule.module) {
                        var module = info.usermodule.module[i];
                        str += "{ \"id\":\"" + module.moduleid + "\", \"pId\":\"" + module.parentmoduleid + "\", \"name\":\"" + module.modulename + "\", \"open\":true";
                        if (info.departmodule.code == 100) {
                            for (var j in info.departmodule.module) {
                                if (module.moduleid == info.departmodule.module[j].moduleid) {
                                    str += ",\"checked\":true";
                                }
                            }
                        }
                        if (info.usermodule.module.length == (parseInt(i) + 1)) {
                            str += "}";
                        } else {
                            str += "},";
                        }

                    }
                } else {
                    ajax_code(info.code);
                }
                str += "]";
                ztreeT(str);
                $("#setRight").modal("show");

            },
            error: function (err) {
                ajax_code(500);

            }
        });
    }
}

var setting = {
    check: {
        enable: true,
        chkboxType: {
            "Y": "ps",
            "N": "ps"
        },
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    view: {
        showIcon: true,
    }
};

function ztreeT(zNodes) {
    var obj = JSON.parse(zNodes);
    $.fn.zTree.init($("#treeDemo"), setting, obj);
};

function qd_qx(e, treeId, treeNode) {
    var module = new Array();
    module.push("");
    var treeObj = $.fn.zTree.getZTreeObj("treeDemo"),
        nodes = treeObj.getCheckedNodes(true),
        v = "";
    for (var i = 0; i < nodes.length; i++) {
        v += nodes[i].name + ",";
        module.push(nodes[i].id);
    }

    $.ajax({
        type: "post",
        url: "../usdt/sysmodule/updateDepartmentModule",
        async: true,
        dataType: "json",
        data: {
            departmentcode: t[0],
            moduleid: module
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (info) {
            if (info.code == 100) {
                $("#setRight").modal("hide");
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}