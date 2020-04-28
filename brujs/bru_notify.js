getAllNotify("", 1);

function add() {
    // $("#addFile").modal("show");
    index_url_y = index_url;
    load("bru-notify-dan.html");
}

var bn_search = "";
var block_node = null;
var blocknode;

function getAllNotify(value, page) {
    bn_search = $("#search_content").val();
    var num = parseInt(10);
    var start = (parseInt(page) - 1) * num;
    $
        .ajax({
            type: "get",
            url: "../usdt/brunotify/getAllNotify",
            async: true,
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', token);
            },
            data: {
                start: start,
                num: num,
                search: bn_search
            },
            success: function (info) {
                console.log(info)
                var str = "";
                if (info.code == 100) {
                    blocknode = info.notify;
                    for (var i in info.notify) {
                        var bn = info.notify[i];
                        str += "<tr><td><input name=\"checkbox\" type=\"checkbox\" value=\""
                            + bn.pid + "\"></td> ";
                        str += "<td class='z-xiaoshou' >" + bn.title + "</td>";
                        str += "<td class='z-xiaoshou'>" + bn.content + "</td>";
                        str += "<td class='z-xiaoshou'>" + bn.createtime + "</td>";
                        str += "</tr>";
                    }
                    $("#notify_center").html(str);
                    center_fy("getAllNotify", value, page, num,
                        info.count);
                } else if (info.code == 101) {
                    $("#notify_center").html("");
                    center_fy("getAllNotify", value, page, num,
                        0);
                }

            },
            error: function (err) {
                console.log(err + "====")
                ajax_code(500);

            }
        });
}

var t = new Array();

function update() {
    t = check(1);
    if (t != false) {
        for (var i in blocknode) {
            if (t[0] == blocknode[i].pid) {
                block_node = blocknode[i];
            }
        }
        index_url_y = index_url;
        load("bru-notify-dan.html");
    }
}

function del() {
    t = check(2);
    if (t != false) {
        $("#delFile").modal("show");
    }
}

function qd_del() {
    $.ajax({
        type: "post",
        url: "../usdt/brunotify/delNotify",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            id: t
        },
        success: function (info) {
            if (info.code == 100) {
                $("#delFile").modal("hide");
                getAllNotify("", 1);
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            console.log(err)
//			ajax_code(500);

        }
    });
}