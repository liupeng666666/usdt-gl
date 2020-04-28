var fb_score;
scoreInfo_select();

function scoreInfo_select() {
    $.ajax({
        type: "post",
        url: "../usdt/FbScore/FbScoreSelect",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                fb_score = info.score;
                for (var i in info.score) {
                    var score = info.score[i];

                    str += "<tr name='0'><td><input name=\"checkbox\" type=\"checkbox\" value=\"" + score.pid + "\"></td>";
                    str += "<td class=\"levels1\">" + score.name + "</td><td>" + score.score + "</td>";

                    if (score.sys == '0') {
                        str += " <td>未默认</td>";
                    } else {
                        str += " <td>已默认</td>";
                    }

                    str += "</tr>";
                }
                $("#score_center").html(str);
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
    $("#qd").attr("onclick", "qd_add()");
    $(":text").val("");
    var str = "";
    str += "<option value='" + 0 + "'>未默认</option>";
    str += "<option value='" + 1 + "'>默认</option>";

    $("#sysSel").html(str);

    $("#addFile").modal("show");
}

function qd_add() {

    var name = $("#name").val();
    if (name == null || name == "") {
        $("#message").html("名称不能为空！");
        return false;
    }

    var score = $("#score").val();
    if (score == null || score == "") {
        $("#message").html("评分不能为空！");
        return false;
    }

    var sys = $("#sysSel").val();
    $.ajax({
        type: "post",
        url: "../usdt/FbScore/FbScoreInsert",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            name: name,
            score: score,
            sys: sys
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                scoreInfo_select();
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
        for (var i in fb_score) {
            var score = fb_score[i];
            if (score.pid == t[0]) {

                $("#name").val(score.name);
                $("#score").val(score.score);
                var str = "";

                if (score.sys == '1') {
                    str += "<option value='" + 0 + "'>未默认</option>";
                    str += "<option value='" + 1 + "' selected>默认</option>";
                } else {
                    str += "<option value='" + 0 + "' selected>未默认</option>";
                    str += "<option value='" + 1 + "'>默认</option>";
                }

                $("#sysSel").html(str);
            }
        }

        $("#qd").attr("onclick", "qd_update()");
        $("#addFile").modal("show");
    }
}

function qd_update() {

    var name = $("#name").val();
    if (name == null || name == "") {
        $("#message").html("名称不能为空！");
        return false;
    }

    var score = $("#score").val();
    if (score == null || score == "") {
        $("#message").html("评分不能为空！");
        return false;
    }

    var sys = $("#sysSel").val();

    $.ajax({
        type: "post",
        url: "../usdt/FbScore/FbScoreUpdate",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            pid: t[0],
            name: name,
            score: score,
            sys: sys
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                scoreInfo_select();
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
        $("#myModalDelLabel").html("删除");
        $("#myModalDelLabelN").html("确定要删除评分信息？");
        $("#qddel").attr("onclick", "qd_del()");
        $("#delFile").modal("show");
    }
}

function qd_del() {

    $.ajax({
        type: "post",
        url: "../usdt/FbScore/FbScoreDelete",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            pid: t,
            isdel: 1
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                scoreInfo_select();
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
