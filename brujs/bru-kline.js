function add() {
    // $("#addFile").modal("show");
    index_url_y = index_url;
    load("bru-kline-dan.html");
}

var t = new Array();
var bru_kline = null;
var brukline;
getBruKlineByTime("", 1);

function getBruKlineByTime(value, page) {
    var starttime = $("#datetimepicker").val();
    var endtime = $("#datetimepicker2").val();
    var num = parseInt(10);
    var start = (parseInt(page) - 1) * num;
    $
        .ajax({
            type: "get",
            url: "../usdt/brukline/getBruKlineByTime",
            async: true,
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', token);
            },
            data: {
                start: start,
                num: num,
                starttime: starttime,
                endtime: endtime
            },
            success: function (info) {
                console.info(info)
                var str = "";
                if (info.code == 100) {
                    brukline = info.kline;
                    for (var i in info.kline) {
                        var bm = info.kline[i];
                        str += "<tr><td><input name=\"checkbox\" type=\"checkbox\" value=\""
                            + bm.pid + "\"></td> ";
                        str += "<td class='z-xiaoshou' >" + bm.open
                            + "</td>";
                        str += "<td class='z-xiaoshou' >" + bm.close
                            + "</td>";
                        str += "<td class='z-xiaoshou' >" + bm.low
                            + "</td>";
                        str += "<td class='z-xiaoshou' >" + bm.high
                            + "</td>";
                        str += "<td class='z-xiaoshou' >" + bm.showtime
                            + "</td>";
                        str += "</tr>";
                    }
                    $("#user_center").html(str);
                    center_fy("getBruKlineByTime", value, page, num,
                        info.count);
                } else if (info.code == 101) {
                    $("#user_center").html("");
                    center_fy("getBruKlineByTime", value, page, num,
                        0);
                }

            },
            error: function (err) {
                ajax_code(500);
            }
        });
}

function update() {
    t = check(1);
    if (t != false) {
        for (var i in brukline) {
            if (t[0] == brukline[i].pid) {
                bru_kline = brukline[i];
            }
        }
        index_url_y = index_url;
        load("bru-kline-dan.html");
    }
}

function del() {
    t = check(2);
    if (t != false) {
        $("#delFile").modal("show");
    }
}

function qd_del() {
    console.log(t)
    $.ajax({
        type: "post",
        url: "../usdt/brukline/delBruKline",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            pid: t
        },
        success: function (info) {
            if (info.code == 100) {
                $("#delFile").modal("hide");
                getBruKlineByTime("", 1);
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}