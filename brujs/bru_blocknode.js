getBlockNodeBySearch("", 1);

function add() {
    // $("#addFile").modal("show");
    index_url_y = index_url;
    load("bru-blocknode-dan.html");
}

var bn_search = "";
var block_node = null;
var blocknode;

function getBlockNodeBySearch(value, page) {
    bn_search = $("#search_content").val();
    var num = parseInt(10);
    var start = (parseInt(page) - 1) * num;
    $
        .ajax({
            type: "get",
            url: "../usdt/blocknode/getBlockNodeBySearch",
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
                var str = "";
                if (info.code == 100) {
                    blocknode = info.node;
                    for (var i in info.node) {
                        var bn = info.node[i];
                        str += "<tr><td><input name=\"checkbox\" type=\"checkbox\" value=\""
                            + bn.id + "\"></td> ";
                        str += "<td class='z-xiaoshou' ><img src=\"" + bn.img + "\" onclick='ImgFile(\"" + bn.img + "\")' width=50 height=50 onerror='imgExists(this,0)'/></td>";
                        str += "<td class='z-xiaoshou'>" + bn.title + "</td>";
                        str += "<td class='z-xiaoshou'>" + bn.price + "</td>";
                        str += "<td class='z-xiaoshou'>" + bn.daybru + "</td>";
                        str += "<td class='z-xiaoshou'>" + bn.alive + "</td>";
                        str += "<td class='z-xiaoshou'>" + bn.period + "</td>";
                        if (typeof (bn.ktnum) == undefined || bn.ktnum == null || bn.ktnum == "") {
                            str += "<td class='z-xiaoshou'>0</td>";
                        } else {
                            str += "<td class='z-xiaoshou'>" + bn.ktnum + "</td>";
                        }
//							str += "<td class='z-xiaoshou'>"+bn.onealive+"</td>";
                        str += "</tr>";
                    }
                    $("#news_center").html(str);
                    center_fy("getBlockNodeBySearch", value, page, num,
                        info.count);
                } else if (info.code == 101) {
                    $("#news_center").html("");
                    center_fy("getBlockNodeBySearch", value, page, num,
                        0);
                }

            },
            error: function (err) {
                ajax_code(500);

            }
        });
}

function ImgFile(src) {
    $("#Z_img").attr("src", src);
    $("#ImgFile").modal("show");
}

var t = new Array();

function update() {
    t = check(1);
    if (t != false) {
        for (var i in blocknode) {
            if (t[0] == blocknode[i].id) {
                block_node = blocknode[i];
            }
        }
        index_url_y = index_url;
        load("bru-blocknode-dan.html");
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
        url: "../usdt/blocknode/delBlockNode",
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
                getBlockNodeBySearch("", 1);
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            console.info(err)
            ajax_code(500);

        }
    });
}