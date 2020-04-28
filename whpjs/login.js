function yanzhengma() {
    $("#Img_YanZhengMa").attr("src", "../usdt/sysuser/SysYanZhengMa?timestamp=" + (new Date()).valueOf());
}

function login() {
    var t = $('#form').serializeArray();
    $.ajax({
        type: "post",
        url: "../usdt/sysuser/userLogin",
        async: true,
        data: t,
        dataType: 'json',
        success: function (info) {
            if (info.code == 100) {
                window.location.href = "index.html?token=" + info.token;
            } else {
                $(".notifyError").html(info.message);
                $(".notifyError").show();
            }
        },
        error: function (err) {
            $(".notifyError").html("服务器走丢了，请稍后再试");
            $(".notifyError").show();
        }
    });
}
