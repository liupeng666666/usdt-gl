var system_news;
var system_new;
var class_id;
var news_name;
news_select("", 1);

function news_select(value, page) {
    news_name = $("#news_name").val();
    var num = parseInt(10);
    var start = (parseInt(page) - 1) * num;
    $.ajax({
        type: "post",
        url: "../usdt/sysnews/SysNewsSelect",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            style: 4,
            start: start,
            num: num,
            name: news_name,
            sys_class_id: class_id
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                system_news = info.news;
                for (var i in info.news) {
                    var news = info.news[i];
                    str += "<tr><td><input name=\"checkbox\" type=\"checkbox\" value=\"" + news.pid + "\"></td> ";
                    str += "<td class='z-xiaoshou' onclick='mess_tc(\"" + news.pid + "\")'><img src=\"" + news.img + "\" width=50 height=50 onerror='imgExists(this,0)'/></td>    ";
                    str += "<td class='z-xiaoshou' onclick='mess_tc(\"" + news.pid + "\")'>" + news.title + "</td>    ";
                    str += "<td class='z-xiaoshou' onclick='mess_tc(\"" + news.pid + "\")'>" + news.y_title + "</td>";
                    str += " <td>" + news.name + "</td>";
                    str += "<td>bru推荐</td> ";

                    str += "<td>" + format(news.createtime, "yy/MM/dd HH:mm:ss") + "</td> ";
                    if (news.top == 0) {
                        str += "<td><button type=\"button\" class=\"btn btn-success\" onclick='zhiding(1,\"" + news.pid + "\")'>置顶</button></td> ";

                    } else {
                        str += "<td><button type=\"button\" class=\"btn btn-danger\" onclick='zhiding(0,\"" + news.pid + "\")'>取消置顶</button></td> ";
                    }
                    str += "</tr>";
                }
            } else {
                ajax_code(info.code);
            }
            $("#news_center").html(str);
            center_fy("news_select", value, page, num, info.count);
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}

function mess_tc(pid) {
    for (var i in system_news) {
        var news = system_news[i];
        if (news.pid == pid) {
            $("#mess_Z").html(news.message);
            $("#mess_Y").html(news.y_message);
        }
    }
    $("#fileStorage").modal("show");
}

function news_qh(id, th) {
    $("button[name='z-button-name']").attr("class", "btn btn-default");
    $(th).attr("class", "btn btn-info");
    $("[name='z-div-name']").hide();
    $("#" + id).show();
}

category_select();

function category_select() {
    $.ajax({
        type: "post",
        url: "../usdt/sysclass/SysClass",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {style: 4},
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                system_category = info.class;
                str += "<li class=\"active\" name='z-ul-li' onclick='class_qh(\"\",this)'><a href=\"javascript:void(0)\">全部分类</a></li>";
                for (var i in info.class) {
                    var sys_class = info.class[i];
                    str += "<li name='z-ul-li' onclick='class_qh(\"" + sys_class.pid + "\",this)'><a href=\"javascript:void(0)\">" + sys_class.name + "</a></li>";
                }
                $("#top-class").html(str);
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}

function class_qh(pid, th) {
    class_id = pid;
    $("[name='z-ul-li']").removeClass("active");
    $(th).addClass("active");
    news_select("", 1);
}

function add() {
    //$("#addFile").modal("show");
    index_url_y = index_url;
    load("bru-news-dan.html");
}

var t = new Array();

function update() {
    t = check(1);
    if (t != false) {

        for (var i in system_news) {
            if (t[0] == system_news[i].pid) {
                system_new = system_news[i];
            }
        }

        index_url_y = index_url;
        load("bru-news-dan.html");
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
        url: "../usdt/sysnews/SysNewsDel",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            pid: t, isdel: 1
        },
        success: function (info) {
            if (info.code == 100) {
                $("#delFile").modal("hide");
                news_select("", 1);
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}

function zhiding(top, pid) {
    var formdata = new FormData();
    formdata.append("top", top);
    formdata.append("pid", pid);
    console.info(formdata);
    $.ajax({
        type: "post",
        url: "../usdt/sysnews/SysNewsUpdate",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: formdata,
        enctype: "multipart/form-data",
        processData: false,
        contentType: false,
        success: function (info) {
            if (info.code == 100) {
                news_select("", 1);
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}
  