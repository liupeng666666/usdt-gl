var sys_system;
system_select();

function system_select() {
    $.ajax({
        type: "post",
        url: "../usdt/syssystem/SysSystemSelect",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                if (info.system != null) {
                    sys_system = info.system;
                    str += "<tr><td><input name=\"checkbox\" type=\"checkbox\" value=\"" + info.system.pid + "\"></td> ";
                    str += "<td>" + info.system.commission + "USDT</td>";
                    str += "<td>" + info.system.minmoney + "USDT</td>";
                    str += "<td>" + info.system.maxmoney + "USDT</td>";
                    str += "<td>" + info.system.brutrade + "%</td>";
                    str += "<td>" + info.system.minbru + "BRU</td>";
                    str += "<td>" + info.system.maxbru + "BRU</td>";
                    str += "<td>" + info.system.lowmoney + "USDT</td>";
                    if (info.system.istime == 0) {
                        str += " <td><i class=\"fa fa-check success\"></i></td>  ";
                    } else {
                        str += " <td><i class=\"fa fa-times danger\"></i></td>  ";
                    }
                    str += "<td>" + info.system.starttime + "</td>";
                    str += "<td>" + info.system.endtime + "</td>";
                    if (info.system.istime == 0) {
                        str += "<td><button type=\"button\" class=\"btn btn-danger\" onclick=\"state(1,'" + info.system.pid + "')\">关闭</button></td> ";

                    } else {
                        str += "<td><button type=\"button\" class=\"btn btn-success\" onclick=\"state(0,'" + info.system.pid + "')\">开启</button></td> ";
                    }
                    str += "</tr>";
                }
                $("#sys_center").html(str);
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

function update() {
    t = check(1);
    if (t != false) {
        $("#datetimepicker").val(sys_system.starttime);
        $("#datetimepicker2").val(sys_system.endtime);
        $("#zxjye").val(sys_system.lowmoney);
        $("#usdttrade").val(sys_system.commission);
        $("#minmoney").val(sys_system.minmoney);
        $("#maxmoney").val(sys_system.maxmoney);
        $("#brutrade").val(sys_system.brutrade);
        $("#minbru").val(sys_system.minbru);
        $("#maxbru").val(sys_system.maxbru);
        $("#addFile").modal("show");
    }
}

function qd_add() {
    var starttime = $("#datetimepicker").val();
    var endtime = $("#datetimepicker2").val();
    var lowmoney = $("#zxjye").val();
    var usdttrade = $("#usdttrade").val();
    var minmoney = $("#minmoney").val();
    var maxmoney = $("#maxmoney").val();
    var brutrade = $("#brutrade").val();
    var minbru = $("#minbru").val();
    var maxbru = $("#maxbru").val();
    $.ajax({
        type: "post",
        url: "../usdt/syssystem/SysSystemUpdate",
        async: true,
        dataType: "json",
        data: {
            starttime: starttime,
            endtime: endtime,
            lowmoney: lowmoney,
            maxbru: maxbru,
            minbru: minbru,
            brutrade: brutrade,
            maxmoney: maxmoney,
            minmoney: minmoney,
            commission: usdttrade,
            pid: t[0]
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (info) {
            if (info.code == 100) {
                system_select();
                $("#addFile").modal("hide");
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    })

}

function state(state, pid) {
    $.ajax({
        type: "post",
        url: "../usdt/syssystem/SysSystemUpdate",
        async: true,
        dataType: "json",
        data: {
            istime: state,
            pid: pid
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (info) {
            if (info.code == 100) {
                system_select();
                $("#addFile").modal("hide");
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    })
}