var search = "";
var bru_user;
var c_state;
var wxd_pid = "";
var obstate = 1;

getBruUserBySearch("", 1);

function getBruUserBySearch(value, page) {
    search = $("#search_content").val();
    var num = parseInt(10);
    var start = (parseInt(page) - 1) * num;
    $
        .ajax({
            type: "post",
            url: "../usdt/bruuser/getBruUserBySearch",
            async: true,
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', token);
            },
            data: {
                start: start,
                num: num,
                search: search,
                obstate: obstate
            },
            success: function (info) {
                var str = "";
                if (info.code == 100) {
                    bru_user = info.user;
                    for (var i in info.user) {
                        var user = info.user[i];
                        str += "<tr><td><input name=\"checkbox\" type=\"checkbox\" value=\"" +
                            user.userid + "\"></td> ";
                        str += "<td><img src=\"" +
                            user.img +
                            "\" width=50 height=50 onerror='imgExists(this,0)'/></td>";
                        str += "<td>" + unde(user.username) + "</td>";
                        str += "<td>" + unde(user.phone) + "</td>";
                        str += "<td>" + unde(user.nickname) + "</td>";
                        if (user.real_name == 1) {
                            str += "<td>已实名</td>";
                        } else if (user.real_name == 0) {
                            str += "<td>未实名</td>";
                        } else {
                            str += "<td>审核失败</td>";
                        }
                        str += "<td>" + unde(user.sid) + "</td>";

                        str += "<td>" + unde(user.nodename) + "</td>";
                        if (user.nodeid == 0) {
                            str += "<td>未开通</td>";
                        } else if (user.nodeid == 1) {
                            str += "<td>超级节点用户</td>";
                        } else if (user.nodeid == 2) {
                            str += "<td>超级节点商户</td>";
                        } else if (user.nodeid == 3) {
                            str += "<td>超级节点商户</td>";
                        }
                        str += "<td>" + unde(user.alive) + "</td>";
                        str += "<td>" + unde(user.allalive) + "</td>";
                        str += "<td>" + unde(user.jdincome) + "</td>";
                        str += "<td>" + unde(user.tgincome) + "</td>";
                        str += "<td>" + unde(user.zcincome) + "</td>";
                        str += "<td>" + unde(user.tynum) + "</td>";
                        str += "<td>" + unde(user.sktnum) + "</td>";
                        str += "<td>" + unde(user.pktnum) + "</td>";
                        str += "<td>" + unde(user.kktnum) + "</td>";
                        str += "<td>" + unde(user.mktnum) + "</td>";
                        str += "<td>" + unde(user.gktnum) + "</td>";
                        str += "<td>" + unde(user.bur_money) + "</td>";
                        str += "<td>" + unde(user.csmoney) + "</td>";
                        str += "<td>" + unde(user.gmmoney) + "</td>";

                        if (user.istask == 0) {
                            str += "<td>可领取</td>";
                        } else {
                            str += "<td>不可领取</td>";
                        }
                        str += "<td><button type='button' class='btn btn-success' onclick=\"wuxiandai('" + user.userid + "')\">查看 </button></td> ";
                        str += "</tr>";
                    }
                    $("#user_center").html(str);
                    center_fy("getBruUserBySearch", value, page, num,
                        info.count);
                } else {
                    $("#user_center").html("");
                    center_fy("getBruUserBySearch", value, page, num, 0);
                }
            },
            error: function (err) {
                ajax_code(500);

            }
        });
}

function changUser(state) {
    t = check(1);
    if (t != false) {
        c_state = state;
        if (state == 1) {
            $("#myModalLabelDel").html("开启任务/禁止任务");
            $("#myModalLabelN").html("确定要该用户禁止领取任务？");
        } else {
            $("#myModalLabelDel").html("开启/冻结");
            $("#myModalLabelN").html("确定要该用户可以领取任务？");
        }
        $("#delFile").modal("show");
    }
}

function userOrderBy(bl, th) {
    obstate = bl;
    $("button[name='top-button']").attr("class", "btn btn-primary");
    $(th).attr("class", "btn btn-success");
    getBruUserBySearch("", 1);
}

function qd_del() {
    $.ajax({
        type: "post",
        url: "../usdt/bruuser/changeBruUser",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            userid: t[0],
            istask: c_state
        },
        success: function (info) {
            if (info.code == 100) {
                getBruUserBySearch("", 1);
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

function bobi_show() {
    t = check(1);
    if (t != false) {
        $("#bobi_modal").modal("show");
    }

}

function brubobi() {
    var bobinum = $("#bobi_num").val();
    var state = $("#state").val();
    if (bobinum.length < 0) {
        bobinum = 0;
    }
    $.ajax({
        type: "post",
        url: "../usdt/bruuser/bobiByUser",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            userid: t[0],
            num: bobinum,
            state: state
        },
        success: function (info) {
            if (info.code == 100) {
                getBruUserBySearch("", 1);
                $("#bobi_modal").modal("hide");
            } else {
                ajax_code(info.code);
            }

        },
        error: function (err) {
            ajax_code(500);

        }
    });

}

function wuxiandai(pid) {
    wxd_pid = pid;
    $.ajax({
        type: "post",
        url: "../usdt/bruuser/SubUserBruBlockRedis",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            pid: pid
        },
        success: function (info) {
            if (info.code == 100) {
                $("#wuxiandai").html("金额：" + info.money + "          更新时间：" + info.createtime);
            } else {
                $("#wuxiandai").html("未更新数据，请先更新数据");
            }
            $("#wuxiandaiFile").modal("show");
        },
        error: function (err) {
            ajax_code(500);

        }
    });

}

function qd_gengxin(th) {
    $("#wuxiandai").html("正在更新，请稍后，请勿进行其他操作");
    $(th).attr("disabled", true);
    $.ajax({
        type: "post",
        url: "../usdt/bruuser/SubUserBruBlock",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            pid: wxd_pid
        },
        success: function (info) {
            if (info.code == 100) {
                $("#wuxiandai").html("已更新，当前金额：" + info.money.money + "          更新时间：" + info.money.createtime);
            } else {
                $("#wuxiandai").html("未更新数据，请先更新数据");
            }
            $(th).attr("disabled", false);
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}