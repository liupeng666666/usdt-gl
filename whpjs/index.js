var index_power = new Array();
var index_user;
var index_url;
var index_url_y;
var report_userid;
var fb_sellid;

var report_start;
var report_end;
var report_state;

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

var token = GetQueryString("token");
$(function () {

    $.ajax({
        type: "post",
        url: "../usdt/sysuser/index",
        async: true,
        dataTyle: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (info) {
            var power_html = '';
            var num = 0;
            if (info.code == 100) {
                if (info.power.code == 100) {
                    index_user = info.user;
                    $("#index_nickname").html(index_user.nickname);
                    $("#index_img").html(index_user.img);
                    index_power = info.power.module;
                    for (var power in info.power.module) {
                        var mes = info.power.module[power];
                        if (mes.parentmoduleid == '0') {
                            if (num == 0) {
                                index_left(mes.moduleid);
                                power_html += "<li class=\"" + mes.css + " active\" onclick='index_left(\"" + mes.moduleid + "\",this)' name='index-li'>";
                            } else {
                                power_html += "<li class=\"" + mes.css + "\" onclick='index_left(\"" + mes.moduleid + "\",this)' name='index-li'>";
                            }

                            power_html += " <a href=\"" + mes.url + "\">";
                            power_html += " <i class=\"" + mes.icon + "\"></i>";
                            power_html += "<h2>" + mes.modulename + "</h2></a></li>";
                            num += 1;
                        }
                    }
                    websocket_lianjie();
                }
                $("#index_ul").html(power_html);
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);
        }
    });
});

function index_left(id, th) {
    $("li").removeClass("active");
    $(th).addClass("active");
    var index_left_power = "";
    var num = 0;
    for (var i in index_power) {
        var module = index_power[i];
        if (module.parentmoduleid == id) {
            if (num == 0) {
                index_left_power += "<li class=\"active\">";
            } else {
                index_left_power += "<li>";
            }

            index_left_power += "<a href=\"javascript:void(0)\" onclick='load(\"" + module.url + "\")' data-role=\"file-system\">";
            index_left_power += "<i class=\"fa fa-caret-right icon-sidebar\"></i><i class=\"fa fa-angle-right icon-right\"></i>" + module.modulename + "</a></li>";
            num += 1;
        }
    }
    $("#index_left").html(index_left_power);
}

function load(url) {
    $('#html_loading').shCircleLoader({
        color: '#8600FF'
    });
    index_url = url;
    $("#html_center").load(url);
}


