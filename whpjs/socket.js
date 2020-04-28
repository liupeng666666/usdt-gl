function ceshi() {
    var message = $("#message").val();
    var json = {
        state: 2,
        id: sub_id,
        img: sub_img,
        nickname: sub_nickname,
        message: message,
        sys_pid: index_user.userid,
        sys_img: index_user.img,
        sys_nickname: index_user.nickname,
        type: 1
    };
    if (sub_id == null || sub_id == "") {
        $("#tip-public-div").html("请选择用户");
        $("#tip-public").show();
        return false;
    } else {
        var jsons = JSON.stringify(json);
        tianjia_map(sub_id, json);
        socket.send(jsons);
        console.info(sub_id);
        socket_zhanshi(false, sub_id);
        $("#message").val("");
    }

}

left_socket();

$(function () {
    $("textarea").keydown(function (event) {
        if (event.keyCode == "13") {
            ceshi();
        }
    });
});