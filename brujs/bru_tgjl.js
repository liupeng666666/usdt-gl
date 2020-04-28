getUserZcTgjl("", 1);

function getUserZcTgjl(value, page) {
    $
        .ajax({
            type: "get",
            url: "../usdt/bruuser/getTgAward",
            async: true,
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', token);
            },
            data: {},
            success: function (info) {
                var str = "";
                if (info.code == 100) {
                    bru_user = info.user;
                    for (var i in info.tg) {
                        var user = info.tg[i];
                        str += "<tr> ";

                        str += "<td>" + unde(user.onealive) + "</td>";
                        str += "<td>" + unde(user.onebru) + "</td>";
                        str += "<td>" + unde(user.twoalive) + "</td>";
                        str += "<td>" + unde(user.twobru) + "</td>";
                        str += "<td>" + unde(user.threealive) + "</td>";
                        str += "<td>" + unde(user.threebru) + "</td>";
                        str += "</tr>";
                        $("#onealive").val(unde(user.onealive));
                        $("#onebru").val(unde(user.onebru));
                        $("#twoalive").val(unde(user.twoalive));
                        $("#twobru").val(unde(user.twobru));
                        $("#threealive").val(unde(user.threealive));
                        $("#threebru").val(unde(user.threebru));
                    }
                    $("#user_center").html(str);
                    center_fy("getUserZcTgjl", value, page, num,
                        info.count);
                } else {
                    $("#user_center").html("");
                    center_fy("getUserZcTgjl", value, page, num, 0);
                }
            },
            error: function (err) {
                ajax_code(500);

            }
        });

}

function qd_tgupdate() {
    var onealive = $("#onealive").val();
    var onebru = $("#onebru").val();
    var twoalive = $("#twoalive").val();
    var twobru = $("#twobru").val();
    var threealive = $("#threealive").val();
    var threebru = $("#threebru").val();
    $
        .ajax({
            type: "get",
            url: "../usdt/bruuser/changeTgAward",
            async: true,
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', token);
            },
            data: {
                onealive: onealive,
                onebru: onebru,
                twoalive: twoalive,
                twobru: twobru,
                threealive: threealive,
                threebru: threebru
            },
            success: function (info) {
                var str = "";
                if (info.code == 100) {
                    $("#fileStorage").modal("hide");
                    getUserZcTgjl("", 1);

                } else {
                }
            },
            error: function (err) {
                ajax_code(500);

            }
        });

}

function updateTg() {
    $("#fileStorage").modal("show");
}