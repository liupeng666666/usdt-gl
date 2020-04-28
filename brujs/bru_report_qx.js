var num = 10;
select(null, 1);

function select(value, page) {
    var p = (page - 1) * num;
    $.ajax({
        type: "post",
        url: "../usdt/BruReport/BruReportSelect",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            start: report_start,
            end: report_end,
            state: report_state,
            page: p,
            num: num
        },
        success: function (info) {
            console.log(info);
            if (info.code == 100) {
                var str = "";
                for (var i in info.report) {
                    var report = info.report[i];
                    str += "<tr><td><input name=\"checkbox\" type=\"checkbox\" value=\"" + report.pid + "\"></td> ";
                    str += "<td>" + report.num + "</td>";
                    str += "<td>" + format(report.createtime, "---") + "</td>";
                    str += "<td>" + format(report.update, "---") + "</td>";
                    if (report.state == 0) {
                        str += "<td>进行中</td>";
                    } else {
                        str += "<td>已完成</td>";
                    }

                    if (report_state == 0) {
                        str += "<td>能量值</td>";
                    } else {
                        str += "<td>流量值</td>";
                    }
                    if (report.type == 0) {
                        str += "<td>自动</td></tr>";
                    } else {
                        str += "<td>手控</td></tr>";
                    }


                }
                $("#report_center").html(str);
                center_fy("select", value, page, num, info.count);
            }

        },
        error: function () {

        }
    })

}

