var class_id;
var fb_state;
var problem_pid;

class_select();

function class_select() {
    $.ajax({
        type: "post",
        url: "../usdt/FbProblemClass/FbProblemClassSelect",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                str += "<li class=\"active\" name='z-ul-li-2' onclick='class_qh(\"\",this,2)'><a href=\"javascript:void(0)\">全部</a></li>";
                for (var i in info.problemClass) {
                    var problemClass = info.problemClass[i];
                    str += "<li name='z-ul-li-2' onclick='class_qh(\"" + problemClass.pid + "\",this,2)'><a href=\"javascript:void(0)\">" + problemClass.title + "</a></li>";
                }
                $("#top-problemClass").html(str);
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}

problem_select("", 1);

function problem_select(value, page) {
    var num = parseInt(10);
    var start = (parseInt(page) - 1) * num;
    $.ajax({
        type: "post",
        url: "../usdt/FbProblem/FbProblemSelect",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            state: fb_state,
            classid: class_id,
            start: start,
            num: num
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                for (var i in info.problem) {
                    var problem = info.problem[i];

                    var arrImg = JSON.parse(problem.img);

                    str += "<tr><td>";
                    for (var j in arrImg) {
                        str += "<img src=\"" + arrImg[j] + "\" width=50 height=50 onclick='imgClick(\"" + arrImg[j] + "\")' onerror='imgExists(this,0)'/>";
                    }

                    str += "</td><td>" + problem.title + "</td>";
                    str += "<td>" + problem.message + "</td>";
                    str += "<td>" + problem.username + "</td>";

                    if (problem.state == "0") {
                        str += "<td>未解决</td>";
                    } else {
                        str += "<td>已解决</td>";
                    }

                    str += "<td>" + problem.programme + "</td>";

                    str += "<td>" + format(problem.createtime, "yy/MM/dd HH:mm:ss") + "</td>";
                    str += "<td><button class='btn btn-default' type='button' onclick='problemMsg(\"" + problem.pid +
                        "\", \"" + problem.title + "\",\"" + problem.state + "\", \"" + problem.message + "\", \"" + problem.programme +
                        "\", \"" + problem.updatetime + "\")'>记录</button></td></tr>"
                }
                $("#problem_center").html(str);
                center_fy("problem_select", value, page, num, info.count);
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}

function class_qh(value, th, state) {
    $("[name='z-ul-li-" + state + "']").removeClass("active");
    $(th).addClass("active");
    if (state == 1) {
        fb_state = value;
    } else if (state == 2) {
        class_id = value;
    }
    problem_select("", 1);
}

function problemMsg(fb_pid, fb_title, fb_state, fb_message, fb_programme, fb_updatetime) {
    $(":text").val("");

    problem_pid = fb_pid;

    $("#class_title").html("<label class=\"form-control\">" + fb_title + " </label>");

    $("#problemMsg").val(fb_message);

    if (fb_state == '0') {
        $("#problem_Pro").html("<textarea name=\"progr\" id=\"programme\" cols=\"\" rows=\"\" class=\"form-control\">未解决</textarea>");

        $("#updateBtn").show();
        $("#selectBtn").hide();
    } else {
        $("#problem_Pro").html("<textarea name=\"progr\" id=\"programme\" cols=\"\" rows=\"\" class=\"form-control\" disabled=\"true\">解决时间：" + format(fb_updatetime, "yy/MM/dd HH:mm:ss") + "   方案：" + fb_programme + "</textarea>");
        $("#updateBtn").hide();
        $("#selectBtn").show();
    }

    $("#updProblemMsg").modal("show");
}

function qd_upd() {

    var programme = $("#programme").val();

    if (programme == null || programme == "") {
        $("#message").html("解决方案不能为空！");
        return false;
    }

    $.ajax({
        type: "post",
        url: "../usdt/FbProblem/FbProblemUpdate",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            pid: problem_pid,
            programme: programme,
            state: 1
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                problem_select("", 1);
                $("#updProblemMsg").modal("hide");
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}

function imgClick(imgValue) {
    var str = "";

    str += "<img src=\"" + imgValue + "\" style=\"max-width:500px\" onerror='imgExists(this,0)'/>";

    $("#meanImgId").html(str);

    $("#meanImg").modal("show");
}