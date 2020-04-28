var sub_team;
var report_user_id;
team();

function team() {
    report_user_id = report_userid;
    team_select();
}

function team_select() {
    $.ajax({
        type: "post",
        url: "../usdt/subteam/SubTeamUser",
        async: true,
        dataType: "json",
        data: {userid: report_user_id},
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (info) {
            var str = "";
            $("#chart").html("");
            if (info.code == 100) {
                sub_team = info.team;
                str += "<li><img src='" + info.user.img + "' width='50px' height='50px'style='border-radius: 50%;'><span id='" + info.user.pid + "' style='line-height:50px'>" + info.user.nickname + "</span>";
                str += "<p><span style='margin-right:10px'>等级:" + info.user.name + "</span><span>团队佣金:" + info.user.team_money + "</span></p>";

                str = digui(str, report_user_id);
                str += "</li>";

                $("#org").html(str);

                $("#org").jOrgChart({
                    chartElement: '#chart',
                    dragAndDrop: true
                });
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}

function digui(str, userid) {
    str += "<ul>";
    var n = 0;
    for (var i in sub_team) {
        var team = sub_team[i];
        if (team.sub_user_id == userid) {
            n += 1;
            str += "<li><img src='" + team.img + "' width='50px' height='50px'style='border-radius: 50%;'><span id='" + team.pid + "' style='line-height:50px'>" + team.nickname + "</span>";
            str += "<p><span style='margin-right:10px'>等级:" + team.name + "</span><span>团队佣金:" + team.team_money + "</span></p>";
            str = digui(str, team.pid);
            str += "</li>";
        }

    }
    str += "<li><p>暂无人员</p><button style='background-color: #F38630;color:#ffffff;border: 1px  #f38630;' type='button' onclick=\"add('" + userid + "')\">添加</button></li>";
    str += "</ul>";
    return str;
}

var xz_userid;

function add(userid) {
    xz_userid = userid;
    $("#addFile").modal("show");
}

function chaxun() {
    var name = $("#name").val();
    if (typeof (name) == "undefined" || name == "") {
        alert("不能为空");
        return false;
    }
    $.ajax({
        type: "post",
        url: "../usdt/subteam/SubUserIsYZ",
        async: true,
        dataType: "json",
        data: {name: name},
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                if (info.user.length == 0) {
                    $("#add_tishi").html("用户不存在或用户已有绑定关系");
                } else {
                    $("#add_tishi").html("");
                }
                for (var i in info.user) {
                    str += "<option value='" + info.user[i].pid + "'>" + info.user[i].nickname + "</option>";
                }

                $("#user_id").html(str);
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}

function qd_add() {
    var pid = $("#user_id").val();
    $.ajax({
        type: "post",
        url: "../usdt/subteam/SubUserInsert",
        async: true,
        dataType: "json",
        data: {pid: pid, sub_user_id: xz_userid},
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                team_select();
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
