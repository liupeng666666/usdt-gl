getBountyMissionBySearch("", 1);

function add() {
    // $("#addFile").modal("show");
    index_url_y = index_url;
    load("bru-bountymission-dan.html");
}

var bm_search = "";
var bounty_mission = null;
var bountymission;

function getBountyMissionBySearch(value, page) {
    bm_search = $("#search_content").val();
    var num = parseInt(10);
    var start = (parseInt(page) - 1) * num;
    $
        .ajax({
            type: "get",
            url: "../usdt/bountymission/getBountyMissionBySearch",
            async: true,
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', token);
            },
            data: {
                start: start,
                num: num,
                search: bm_search
            },
            success: function (info) {
                var str = "";
                if (info.code == 100) {
                    bountymission = info.task;
                    for (var i in info.task) {
                        var bm = info.task[i];
                        str += "<tr><td><input name=\"checkbox\" type=\"checkbox\" value=\""
                            + bm.taskid + "\"></td> ";
                        str += "<td class='z-xiaoshou' >" + bm.tasktitle
                            + "</td>";
                        if (bm.level == 0) {
                            str += "<td class='z-xiaoshou' >初级</td>";
                        } else if (bm.level == 1) {
                            str += "<td class='z-xiaoshou' >中级</td>";
                        } else if (bm.level == 2) {
                            str += "<td class='z-xiaoshou' >高级</td>";
                        }

                        str += "<td class='z-xiaoshou' >" + bm.money
                            + "</td>";
                        var lschannel = bm.channel.split(",");
                        var cstr = "";
                        for (var j = 0; j < lschannel.length; j++) {
                            if (lschannel[j] == "bd") {
                                cstr += "百度,";
                            } else if (lschannel[j] == "we2") {
                                cstr += "微信朋友圈,";
                            } else if (lschannel[j] == "xl") {
                                cstr += "新浪微博,";
                            } else if (lschannel[j] == "al") {
                                cstr += "支付宝,";
                            } else if (lschannel[j] == "qq3") {
                                cstr += "QQ空间,";
                            } else if (lschannel[j] == "we") {
                                cstr += "微信,";
                            } else if (lschannel[j] == "qq") {
                                cstr += "QQ,";
                            }
                        }
                        cstr = cstr.substring(0, cstr.lastIndexOf(','));
                        if (bm.bstate == 0) {
                            str += "<td class='z-xiaoshou' >BRU</td>";
                        } else {
                            str += "<td class='z-xiaoshou' >活跃度</td>";
                        }

                        str += "<td class='z-xiaoshou' >" + cstr
                            + "</td>";
                        str += "<td class='z-xiaoshou' >" + bm.createtime
                            + "</td>";
                        str += "</tr>";
                    }
                    $("#news_center").html(str);
                    center_fy("getBountyMissionBySearch", value, page, num,
                        info.count);
                } else if (info.code == 101) {
                    $("#news_center").html("");
                    center_fy("getBountyMissionBySearch", value, page, num,
                        0);
                }

            },
            error: function (err) {
                ajax_code(500);
            }
        });
}

var t = new Array();

function update() {
    t = check(1);
    if (t != false) {
        for (var i in bountymission) {
            if (t[0] == bountymission[i].taskid) {
                bounty_mission = bountymission[i];
            }
        }
        index_url_y = index_url;
        load("bru-bountymission-dan.html");
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
        url: "../usdt/bountymission/delBountyMission",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            taskid: t
        },
        success: function (info) {
            if (info.code == 100) {
                $("#delFile").modal("hide");
                getBountyMissionBySearch("", 1);
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}