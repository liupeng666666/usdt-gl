var num = 10;
var state;
var type;
select(null, 1);

function select(value, page) {
    var p = (page - 1) * num;
    $.ajax({
        type: "post",
        url: "../usdt/BruReport/BruReportSysSelect",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            page: p,
            num: num,
            state: state,
            type: type
        },
        success: function (info) {
            console.log(info);
            if (info.code == 100) {
                var str = "";
                for (var i in info.report) {
                    var report = info.report[i];
                    str += "<tr><td><input name=\"checkbox\" type=\"checkbox\" value=\"" + report.pid + "\"></td> ";
                    str += "<td>" + report.money + "</td>";
                    str += "<td>" + format(report.createtime, "---") + "</td>";
                    str += "<td>" + format(report.endtime, "---") + "</td>";
                    str += "<td>" + report.sum_money + "</td>";
                    if (report.type == 0) {
                        str += "<td>能量值</td>";
                    } else {
                        str += "<td>流量值</td>";
                    }

                    str += "<td><button class='btn btn-success' type='button' onclick='xiangqing(\"" + format(report.createtime, "---") + "\",\"" + format(report.endtime, "---") + "\",\"" + report.type + "\")'>详情</button></td></tr>";

                }
                $("#report_center").html(str);
                center_fy("select", value, page, num, info.count);
            }

        },
        error: function () {

        }
    })

}

function class_qh(pid, th, st) {
    if (st == 2) {
        state = pid;
        $("[name='z-ul-li-2']").removeClass("active");
        $(th).addClass("active");
    } else {
        type = pid;
        $("[name='z-ul-li-3']").removeClass("active");
        $(th).addClass("active");
    }

    select("", 1);
}

function add() {
    $("#money").val("");
    $("#addFile").modal("show");
}

function qd_up() {
    var up_state = $("#state").val();
    var up_money = $("#money").val();
    $.ajax({
        type: "post",
        url: "../usdt/BruReport/BruReportSysUpdate",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            type: up_state,
            money: up_money
        },
        success: function (info) {
            if (info.code == 100) {
                select(null, 1);
                $("#addFile").modal("hide");
            }

        },
        error: function (err) {

        }
    })
}

function shoukong() {
    $("#s_money").val("");
    $("#shoukongFile").modal("show");
}

function qd_sk() {

    var up_state = $("#s_state").val();
    var up_money = $("#s_money").val();
    $.ajax({
        type: "post",
        url: "../usdt/BruReport/BruReportUpdate",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            state: up_state,
            money: up_money
        },
        success: function (info) {
            if (info.code == 100) {
                select(null, 1);
                $("#shoukongFile").modal("hide");
            }

        },
        error: function (err) {

        }
    })
}

function xiangqing(start, end, q_state) {
    report_state = q_state;
    report_start = start;
    report_end = end;
    load("bru-report-xq.html");
}
