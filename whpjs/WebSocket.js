var map = new Map();
var z_map = new Map();
var socket_num = 0;
var socket;

var sub_id;
var sub_nickname;
var sub_img;

function websocket_lianjie() {
    if (typeof (WebSocket) == "undefined") {
        console.log("您的浏览器不支持WebSocket");
    } else {
        console.log("您的浏览器支持WebSocket");
        //socket = new WebSocket("ws://127.0.0.1:8090/WebSocket/ID=B." + index_user.userid);

        socket = new WebSocket("wss://socket.b-currency.com/usdt_socket/WebSocket/ID=B." + index_user.userid);
        //打开事件
        socket.onopen = function () {
            console.log("Socket 已打开");
            //socket.send("这是来自客户端的消息" + location.href + new Date());
        };
        //获得消息事件
        socket.onmessage = function (msg) {
            console.log(msg.data);
            //发现消息进入    调后台获取
            //getCallingList();
            send_message(JSON.parse(msg.data));
        };
        //关闭事件
        socket.onclose = function () {
            console.log("Socket已关闭");
        };
        //发生了错误事件
        socket.onerror = function () {
            $("#tip-public-div").html("在线客服走丢了，请联系技术人员");
            $("#tip-public").show();
            return false;
        }
        $(window).unload(function () {
            socket.close();
        });

    }

}

function send_message(message) {
    if (message.code == 500) {
        var array = new Array(map.get(message.id));
        socket_num -= array.length;
        map.delete(message.id);
    } else if (message.code == 100) {
        socket_num += 1;
        if (typeof (map.get(message.id)) != "undefined") {
            var array = map.get(message.id);
            array.push(message);
            map.set(message.id, array);
        } else {
            var array = new Array(message);
            map.set(message.id, array);
        }
    }
    $("#index_zxkf").text(socket_num);
    left_socket();
    if (sub_id == message.id) {
        map_socket(message.id);
    }

}

function left_socket() {
    var str = "";
    if (index_url == "WebSocket.html") {
        map.forEach(function (item, key, mapobj) {
            var message = new Array(map.get(key))[0];
            var json = message[0];
            if (typeof (json) != 'undefined') {
                str += "<li onclick='socket_zhanshi(this,\"" + json.id + "\")' name='socket'>";
                str += "<div class=\"col-xs-3\"><img  src=\"" + json.img + "\" class=\"img-circle\" onerror='imgExists(this,0)'/></div>";
                str += "<div class=\"col-xs-6\"><span style=\"line-height: 50px;\">" + json.nickname + "</span></div>";
                str += "<div class=\"col-xs-3\"><span class=\"label label-danger tubiao\" id=\"shuliang_" + key + "\">" + message.length + "</span></div>"
                str += "</li>";
            }
        })
        console.info(str);
        $("#socket-left").html(str);
    }
}

var dq_key;

function socket_zhanshi(th, id) {
    $("#socket_right").html("");
    if (th != false) {
        $("li[name='socket']").attr("class", "");
        $(th).attr("class", "active");
    }
    var str = "";
    z_map.forEach(function (item, key, mapobj) {
        if (("" + key) == (id + "")) {
            if (new Array(z_map.get(key)).length != 0) {
                var message = new Array(z_map.get(key))[0];
                for (var i in message) {
                    var json = message[i];
                    sub_id = json.id;
                    sub_nickname = json.nickname;
                    sub_img = json.img;
                    if (json.state == 1) {
                        str += "<div class=\"liaotian\">";
                        str += "<div class=\"col-xs-1\"><img src=\"" + json.img + "\" class=\"img-circle\" onerror='imgExists(this,0)'></div>";
                        str += "<div class=\"col-xs-11\">";
                        str += "<div>" + json.nickname + "<span style=\"padding-left:5px\"></span></div>";
                        str += "<div class=\"message-hui\">" + json.message + "</div>";
                        str += "</div>";
                        str += "</div>";
                    } else {
                        str += "<div class=\"liaotian\">";
                        str += "<div class=\"col-xs-11\" style=\"text-align: right;\">";
                        str += "<div>" + json.sys_nickname + "<span style=\"padding-left:5px\"></span></div>";
                        str += "<div class=\"message-hui\">" + json.message + "</div>";
                        str += "</div>";
                        str += "<div class=\"col-xs-1\"><img src=\"" + json.sys_img + "\" class=\"img-circle\" onerror='imgExists(this,0)'></div>";
                        str += "</div>";
                    }
                }
            }
            $("#socket_right").html(str);
            $('#socket_right').scrollTop($('#socket_right')[0].scrollHeight);
        }
    });
    map_socket(id);

}

function tianjia_map(key, message) {
    if (typeof (z_map.get(key)) != "undefined") {
        var array = z_map.get(key);
        array.push(message);
        z_map.set(key, array);
    } else {
        var array = new Array(message);
        z_map.set(key, array);
    }
}

function map_socket(id) {
    map.forEach(function (item1, key1, mapobj1) {
        console.info(key1 + "==" + id);
        if (key1 == id) {
            if (new Array(map.get(key1)).length != 0) {
                var message1 = new Array(map.get(key1))[0];
                for (var j in message1) {
                    var json = message1[j];
                    sub_id = json.id;
                    sub_nickname = json.nickname;
                    sub_img = json.img;

                    var str1 = "";
                    str1 += "<div class=\"liaotian\">";
                    str1 += "<div class=\"col-xs-1\"><img src=\"" + json.img + "\" class=\"img-circle\" onerror='imgExists(this,0)'></div>";
                    str1 += "<div class=\"col-xs-11\">";
                    str1 += "<div>" + json.nickname + "</div>";
                    str1 += "<div class=\"message-hui\">" + json.message + "</div>";
                    str1 += "</div>";
                    str1 += "</div>";
                    $("#socket_right").append(str1);
                    $('#socket_right').scrollTop($('#socket_right')[0].scrollHeight);
                    socket_num -= 1;
                    $("#index_zxkf").text(socket_num);

                    tianjia_map(key1, json);
                }
            }
            map.set(key1, new Array());
            $("#shuliang_" + id).html("");
        }
    });
}

function YueDu(id) {
    $.ajax({
        type: "post",
        url: "../usdt/WebIm/YueDu",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            "from": id
        },
        success: function (info) {

        },
        error: function (err) {

        }
    });
}

function yidu() {
    var id = sub_id;
    YueDu(id);
}