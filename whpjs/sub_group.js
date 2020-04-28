var sub_group;
group_select("", 1);

function group_select(value, page) {
    var top = $("#top").val();
    var state = $("#state").val();
    var name = $("#name").val();
    var audit = $("#audit").val();
    var num = parseInt(10);
    var start = (parseInt(page) - 1) * num;
    $.ajax({
        type: "post",
        url: "../usdt/subgroup/SubGroupSelect",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            start: start,
            num: num,
            state: state,
            top: top,
            name: name,
            audit: audit
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                sub_group = info.group;
                for (var i in info.group) {
                    var group = info.group[i];
                    str += "<tr><td><input name=\"checkbox\" type=\"checkbox\" value=\"" + group.pid + "\"></td> ";
                    str += "<td><img src=" + group.img + " width=50px height=50px onerror='imgExists(this,0)'></td>";
                    str += "<td>" + group.name + "</td>";
                    if (group.top == 0) {
                        str += "<td>未置顶</td>";
                    } else {
                        str += "<td>置顶</td>";
                    }
                    if (group.state == 0) {
                        str += "<td>私有</td>";
                        str += "<td>" + group.nickname + "</td>";
                    } else {
                        str += "<td>公开</td>";
                        str += "<td>系统管理员</td>";
                    }

                    str += "<td>" + group.num + "</td>";
                    str += "<td>" + format(group.createtime, "yy/MM/dd HH:mm:ss") + "</td>";
                    str += "<td>" + format(group.expire, "yy/MM/dd HH:mm:ss") + "</td>";
                    if (group.audit == 0) {
                        str += "<td>未审核</td>";
                        str += "<td><button class='btn btn-danger' type='button' onclick='shenhe(\"" + group.pid + "\")'>审核</button></td>";
                    } else if (group.audit == 1) {
                        str += "<td>审核通过</td>";
                        str += "<td></td>";
                    } else {
                        str += "<td>审核不通过</td>";
                        str += "<td></td>";
                    }

                    str += "</tr>";
                }
                $("#sys_center").html(str);
                center_fy("group_select", "", page, num, info.count);
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    })

}

var t = new Array();

function update(state, value) {
    t = check(2);
    if (t != false) {
        var state;
        var top;
        if (state == 1) {
            state = value;
        } else {
            top = value;
        }
        $.ajax({
            type: "post",
            url: "../usdt/subgroup/SubGroupUpdate",
            async: true,
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', token);
            },
            data: {
                pid: t,
                top: top
            },
            success: function (info) {
                if (info.code == 100) {
                    group_select("", 1);
                } else {
                    ajax_code(info.code);
                }
            },
            error: function (err) {
                ajax_code(500);

            }
        })
    }
}

function add() {
    $("#addFile").modal("show");
}

function qd_add() {
    var img = document.getElementById("file-add").files[0];
    var name = $("#addname").val();
    var intro = $("#intro").val();
    var formdata = new FormData();
    formdata.append("name", name);
    formdata.append("intro", intro);
    formdata.append("img", img);
    $.ajax({
        type: "post",
        url: "../usdt/subgroup/SubGroupInsert",
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
                group_select("", 1);
                $("#addFile").modal("hide");
            } else if (info.code == 102) {
                $("#add_tishi").html("创建环信群组失败");
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
    $("#file-update").fileinput({
        showCaption: false,
        browseClass: "btn btn-ls",
        fileType: "any",
        showUpload: false
    })
};
var group_pid;
var group_userid;

function shenhe(pid) {
    for (var i in sub_group) {
        var group = sub_group[i];
        if (group.pid == pid) {
            group_pid = pid;
            group_userid = group.userid;
            $("#myModalLabelTitle").html("群名：" + group.name);
            $("#myModalLabelN").html("简介：" + group.intro);
            $("#updatreFile").modal("show");
        }
    }
}

function qd_shenhe(audit) {
    $.ajax({
        type: "post",
        url: "../usdt/subgroup/SubGroupShenHe",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            pid: group_pid,
            audit: audit,
            userid: group_userid
        },
        success: function (info) {
            if (info.code == 100) {
                group_select("", 1);
                $("#updatreFile").modal("hide");
            } else {
                ajax_code(info.code);
            }

        },
        error: function (err) {
            ajax_code(500);

        }
    });
}

var del;

function del() {
    del = check(2);
    if (del != false) {
        $("#delFile").modal("show");
    }
}

function qd_del() {
    $.ajax({
        type: "post",
        url: "../usdt/subgroup/SubGroupUpdate",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            pid: del,
            isdel: 1
        },
        success: function (info) {
            if (info.code == 100) {
                group_select("", 1);
            } else {
                ajax_code(info.code);
            }
            $("#delFile").modal("hide");
        },
        error: function (err) {
            ajax_code(500);

        }
    })
}

function img_update() {
    t = check(1);
    if (t != false) {
        for (var i in sub_group) {
            var group = sub_group[i];
            if (group.pid == t[0]) {
                $("#updatename").val(group.name);
                $("#updateintro").val(group.intro);
                $("#update_img").attr("src", group.img);
            }
        }
        $("#updateFile").modal("show");
    }
}

function qd_update() {
    var img = document.getElementById("file-update").files[0];
    var name = $("#updatename").val();
    var intro = $("#updateintro").val();
    var formdata = new FormData();
    formdata.append("name", name);
    formdata.append("intro", intro);
    formdata.append("img", img);
    formdata.append("pid", t[0]);
    $.ajax({
        type: "post",
        url: "../usdt/subgroup/SubGroupUpdateImg",
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
                group_select("", 1);
                $("#updateFile").modal("hide");
            } else {
                ajax_code(info.code);
            }

        },
        error: function (err) {
            ajax_code(500);

        }
    });
}
