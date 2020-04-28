var system_part;
var system_role;
var system_user;
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

jQuery(document).ready(function (a) {
    file_input_trigger();
});

function file_input_trigger() {
    $("#file-add").fileinput({
        showCaption: false,
        browseClass: "btn btn-ls",
        fileType: "any",
        showUpload: false
    })
};

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
    $("#user-part").html(m);
    role_department = clickFlag;
    user_select(clickFlag.id, 1);
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

function user_select(depart, num) {
    var end = 10;
    var start = (parseInt(num) - 1) * parseInt(end);
    $.ajax({
        type: "post",
        url: "../usdt/sysuser/getSysDepartUser",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            start: start,
            end: end,
            departmentcode: depart
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                system_user = info.user;
                for (var i in info.user) {
                    var user = info.user[i];
                    str += "<tr><td><input type=\"checkbox\" name=\"checkbox\" value=\"" + user.userid + "\"/></td>";
                    str += "  <td><img src=" + user.img + " width=50 height=50 onerror='imgExists(this,0)'></td>";
                    str += "  <td>" + unde(user.username) + "</td>";
                    str += "  <td>" + unde(user.nickname) + "</td>";
                    str += "  <td>" + unde(user.phone) + "</td>";
                    if (user.state == 0) {
                        str += " <td><i class=\"fa fa-check success\"></i></td>  ";
                    } else {
                        str += " <td><i class=\"fa fa-times danger\"></i></td>  ";
                    }

                    str += " <td>" + unde(user.rolename) + "</td>";

                    if (unde(user.lasteditdatetime) != "") {
                        str += " <td>" + format(unde(user.lasteditdatetime), "yyyy-mm-dd HH:mm:ss") + "</td>   ";
                    } else {
                        str += " <td></td>   ";

                    }

                    str += " </tr>";

                }
                var count = info.count;
                center_fy("user_select", depart, num, end, count);
            } else {
                ajax_code(info.code);
            }
            $("#user_center").html(str);
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
    $(":text").val("");
    $("#update_img").hide();
    $(".form-group.password").show();
    $("#qd").attr("onclick", "qd_add()");
    $("#username").attr("disabled", false);
    $("#phone").attr("disabled", false);
    $("#add_depart").val(role_department.name);
    role_select(role_department.id, 1, "");
    $("#addUser").modal("show");
}

function qd_add() {
    var username = $("#username").val();
    var nickname = $("#nickname").val();
    var password = $("#password").val();
    var password2 = $("#password2").val();
    var img = document.getElementById("file-add").files[0];
    var phone = $("#phone").val();
    console.info(username);
    if (username == "") {
        $("#add_tishi").html("用户名不能为空");
        return false;
    }
    if (phone == "") {
        $("#add_tishi").html("手机号不能为空");
        return false;
    }
    if (password == "") {
        $("#add_tishi").html("密码不能为空");
        return false;
    }
    if (password2 == "") {
        $("#add_tishi").html("重复密码不能为空");
        return false;
    }
    if (password != password2) {
        $("#add_tishi").html("密码不一致");
        return false;
    }

    var pid_array = new Array();
    pid_array.push("");
    var str = $("input[name='addcheckbox']");
    var objarray = str.length;
    var pid;
    var formdata = new FormData();
    formdata.append("departmentcode", role_department.id);
    formdata.append("username", username);
    formdata.append("password", password);
    formdata.append("phone", phone);
    formdata.append("nickname", nickname);
    formdata.append("img", img);
    for (i = 0; i < objarray; i++) {
        if (str[i].checked == true) {
            pid = str[i].value;
            pid_array.push(pid);
            formdata.append("roleid[]", pid);
        }
    }

    $.ajax({
        type: "post",
        url: "../usdt/sysuser/addSysUser",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: formdata,
        enctype: "multipart/form-data",
        processData: false,
        contentType: false,

        success: function (info) {
            if (info.code == 100) {
                user_select(role_department.id, 1);
                $("#addUser").modal("hide");
            } else if (info.code == 104) {
                $("#add_tishi").html(info.message);
            } else {
                ajax_code(info.code);
            }

        },
        error: function (err) {
            ajax_code(500);

        }
    });
}

function role_select(depart, state, roleid) {
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
                    str += "<li><i></i><label><input name=\"addcheckbox\" type=\"checkbox\" value=\"" + role.roleid + "\"";
                    if (state == 2) {
                        if (roleid != "" && roleid != null) {
                            var sz = new Array();
                            sz = roleid.split(",");
                            for (var j in sz) {
                                if (role.roleid == sz[j]) {
                                    str += "checked";
                                }
                            }
                        }
                    }
                    str += "><span>" + role.rolename + "</span></label></li>";
                }
            } else {
                ajax_code(info.code);
            }
            $("#user_role").html(str);
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}

function update() {
    t = check(1);
    console.info(t);
    if (t != false) {
        for (var i in system_user) {
            var user = system_user[i];
            if (user.userid == t[0]) {
                $("#username").val(user.username);
                $("#nickname").val(user.nickname);
                $("#phone").val(user.phone);
                $("#phone").attr("disabled", "disabled");
                $("#username").attr("disabled", "disabled");
                $("#update_img").show();
                $("#img").attr("src", user.img);
                role_select(role_department.id, 2, user.roleid);
            }
        }
        $("#qd").attr("onclick", "qd_update()");
        $(".form-group.password").hide();
        $("#addUser").modal("show");
    }
}

function qd_update() {
    var nickname = $("#nickname").val();
    var pid_array = new Array();
    pid_array.push("");
    var str = $("input[name='addcheckbox']");
    var objarray = str.length;
    var pid;
    var formdata = new FormData();
    for (i = 0; i < objarray; i++) {
        if (str[i].checked == true) {
            pid = str[i].value;
            pid_array.push(pid);
            formdata.append("roleid[]", pid);
        }
    }
    var img = document.getElementById("file-add").files[0];
    formdata.append("userid", t[0]);
    formdata.append("nickname", nickname);
    formdata.append("img", img);
    $.ajax({
        type: "post",
        url: "../usdt/sysuser/updateSysUserInfo",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: formdata,
        enctype: "multipart/form-data",
        processData: false,
        contentType: false,
        success: function (info) {
            if (info.code == 100) {
                user_select(role_department.id, 1);
                $("#addUser").modal("hide");
            } else if (info.code == 104) {
                $("#add_tishi").html(info.message);
            } else {
                ajax_code(info.code);
            }

        },
        error: function (err) {
            ajax_code(500);

        }
    });
}

var del_state;

function del(state) {
    t = check(2);
    if (t != false) {
        del_state = state;
        if (state == 1) {
            $("#myModalLabel").html("开启");
            $("#myModalLabelN").html("确定要开启用户？");
        } else if (state == 2) {
            $("#myModalLabel").html("停用");
            $("#myModalLabelN").html("确定要停用用户？");
        } else if (state == 3) {
            $("#myModalLabel").html("删除");
            $("#myModalLabelN").html("确定要删除用户？");
        }
        $("#delUser").modal("show");
    }
}

function qd_del() {
    var roleid = new Array();
    roleid.push("");
    $.ajax({
        type: "post",
        url: "../usdt/sysuser/updateSysUser",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            userid: t,
            style: del_state,
            roleid: roleid
        },
        success: function (info) {
            if (info.code == 100) {
                user_select(role_department.id, 1);
                $("#delUser").modal("hide");
            } else if (info.code == 104) {
                $("#add_tishi").html(info.message);
            } else {
                ajax_code(info.code);
            }

        },
        error: function (err) {
            ajax_code(500);

        }
    });
}

function pas() {
    t = check(1);
    if (t != false) {
        $(":text").val("");
        $("#edituserPassword").modal("show");
    }
}

function qd_pas() {
    var password = $("#epass").val();
    var roleid = new Array();
    roleid.push("");
    $.ajax({
        type: "post",
        url: "../usdt/sysuser/updateSysUserInfo",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            userid: t[0],
            password: password,
            roleid: roleid
        },
        success: function (info) {
            if (info.code == 100) {
                user_select(role_department.id, 1);
                $("#edituserPassword").modal("hide");
            } else if (info.code == 104) {
                $("#add_tishi").html(info.message);
            } else {
                ajax_code(info.code);
            }

        },
        error: function (err) {
            ajax_code(500);

        }
    });
}

function ip() {
    t = check(1);
    $.ajax({
        type: "post",
        url: "../usdt/sysip/SysUserIp",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            userid: t[0]
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                for (var i in info.ip) {
                    if (i == 0) {
                        str += info.ip[i].ip;
                    } else {
                        str += "," + info.ip[i].ip;
                    }
                }
            } else {
                ajax_code(info.code);
            }
            $("#eip").val(str);
        },
        error: function (err) {
            ajax_code(500);

        }
    });

    $("#edituserIP").modal("show");
}

function qd_ip() {
    var ips = new Array();
    var ip = $("#eip").val();
    if (ip != "") {
        ips = ip.split(",");
    } else {
        ips.push("");
    }
    $.ajax({
        type: "post",
        url: "../usdt/sysip/SysUpdateIp",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            userid: t[0],
            ip: ips
        },
        success: function (info) {
            if (info.code == 100) {
                $("#edituserIP").modal("hide");
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}