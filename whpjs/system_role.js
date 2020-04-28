var system_part;
var system_role;
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
            var str = "[";
            if (info.code == 100) {
                system_part = info.part;
                for (var i in info.part) {
                    var part = info.part[i];
                    str += "{ \"id\":\"" + part.departmentcode + "\", \"pId\":\"" + part.parentdepartmentcode + "\", \"name\":\"" + part.departmentname + "\", \"open\":true";
                    if (info.part.length == (parseInt(i) + 1)) {
                        str += "}";
                    } else {
                        str += "},";
                    }
                }
                str += "]";
                ztree(str, 1);
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}

var setting = {
    check: {
        enable: false,
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
    },
    callback: {
        onClick: zTreebeforeClick
    }
};
var settingRight = {
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

function ztree(zNodes, state) {
    var json = JSON.parse(zNodes);
    if (state == 1) {
        $.fn.zTree.init($("#treeDemo"), setting, json);
        console.info("eeee");
    } else {
        $.fn.zTree.init($("#roleRight"), settingRight, json);
    }
};
var role_department;

function zTreebeforeClick(treeId, treeNode, clickFlag) {
    var message = "";
    var m = digui(clickFlag, message);
    m += clickFlag.name;
    $("#role-part").html(m);
    role_department = clickFlag;
    role_select(clickFlag.id);
}

function digui(clickFlag) {
    var message = "";
    var ne = clickFlag.getParentNode();
    if (ne != null && ne != "null") {
        message = digui(ne);
        message += ne.name + ">";
    }
    return message;
}

function role_select(depart) {
    $.ajax({
        type: "post",
        url: "../usdt/sysrole/getDepartRole",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            departmentcode: depart
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                system_role = info.role;
                for (var i in info.role) {
                    var role = info.role[i];
                    str += "<tr>";
                    str += " <td><input name=\"checkbox\" type=\"checkbox\" value=\"" + role.roleid + "\"></td>";
                    str += " <td>" + role.rolename + "</td>";
                    if (typeof (role.rolememo) == "undefined") {
                        str += "<td></td>";
                    } else {
                        str += "<td>" + role.rolememo + "</td>";
                    }

                    str += "</tr>";
                }
            } else {
                ajax_code(info.code);
            }
            $("#role_center").html(str);
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}

function add() {
    if (role_department == null) {
        public_tishi("请先选择一个部门");
        return false;
    }
    $.ajax({
        type: "get",
        url: "../usdt/sysmodule/getModuleByDepartment?departmentcode=" + role_department.id,
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (info) {
            var str = "[";
            if (info.code == 100) {
                for (var i in info.module) {
                    var module = info.module[i];
                    str += "{ \"id\":\"" + module.moduleid + "\", \"pId\":\"" + module.parentmoduleid + "\", \"name\":\"" + module.modulename + "\", \"open\":true";
                    if (info.module.length == (parseInt(i) + 1)) {
                        str += "}";
                    } else {
                        str += "},";
                    }
                }
                str += "]";
                ztree(str, 2);
            } else {
                str += "]";
                ztree(str, 2);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });

    $("#add_depart").val(role_department.name);
    $("#addFile").modal("show");
}

function qd_add() {
    var rolename = $("#rolename").val();
    var rolememo = $("#rolememo").val();
    var moduleid = ztree_xz();
    $.ajax({
        type: "post",
        url: "../usdt/sysrole/addSysRole",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            rolename: rolename,
            rolememo: rolememo,
            departmentcode: role_department.id,
            moduleid: moduleid
        },
        success: function (info) {
            if (info.code == 100) {
                $("#addFile").modal("hide");
                role_select(role_department.id);
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}

function ztree_xz() {
    var module = new Array();
    module.push("");
    var treeObj = $.fn.zTree.getZTreeObj("roleRight"),
        nodes = treeObj.getCheckedNodes(true),
        v = "";
    for (var i = 0; i < nodes.length; i++) {
        v += nodes[i].name + ",";
        module.push(nodes[i].id);
    }
    return module;
}

var t = new Array();

function update() {
    var role;
    t = check(1);
    console.info(t);
    if (t != false) {

        for (var i in system_role) {
            if (system_role[i].roleid == t[0]) {
                role = system_role[i];
            }
        }

        console.info(role);


        $.ajax({
            type: "post",
            url: "../usdt/sysmodule/getModuleByRole",
            async: true,
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', token);
            },
            data: {
                departmentcode: role_department.id,
                roleid: role.roleid
            },
            success: function (info) {
                var str = "[";
                if (info.departmodule.code == 100) {
                    for (var i in info.departmodule.module) {
                        var module = info.departmodule.module[i];
                        str += "{ \"id\":\"" + module.moduleid + "\", \"pId\":\"" + module.parentmoduleid + "\", \"name\":\"" + module.modulename + "\", \"open\":true";
                        if (info.rolemodule.code == 100) {
                            for (var j in info.rolemodule.module) {
                                if (info.rolemodule.module[j].moduleid == module.moduleid) {
                                    str += ",\"checked\":true";
                                }
                            }
                        }
                        if (info.departmodule.module.length == (parseInt(i) + 1)) {
                            str += "}";
                        } else {
                            str += "},";
                        }
                    }
                    str += "]";
                    console.info(str);
                    ztree(str, 2);
                } else {
                    str += "]";
                    ztree(str, 2);
                }
            },
            error: function (err) {
                ajax_code(500);

            }
        });
    }
    $("#add_depart").val(role_department.name);
    $("#rolename").val(role.rolename);
    $("#rolememo").val(role.rolememo);
    $("#addFile").modal("show");
    $("#qd").attr("onclick", "qd_update()");
}

function qd_update() {
    var rolename = $("#rolename").val();
    var rolememo = $("#rolememo").val();
    var moduleid = ztree_xz();
    $.ajax({
        type: "post",
        url: "../usdt/sysrole/updateSysRole",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            roleid: t[0],
            rolename: rolename,
            rolememo: rolememo,
            moduleid: moduleid
        },
        success: function (info) {
            if (info.code == 100) {
                $("#addFile").modal("hide");
                role_select(role_department.id);
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
        url: "../usdt/sysrole/delSysRole",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            roleid: t
        },
        success: function (info) {
            if (info.code == 100) {
                $("#delFile").modal("hide");
                role_select(role_department.id);
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}

