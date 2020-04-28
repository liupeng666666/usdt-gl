function qd_update() {
    var password = $("#password").val();
    var password2 = $("#password2").val();
    if (password == "") {
        $("#add_tishi").html("新密码不能为空");
        return false;
    }
    if (password2 == "") {
        $("#add_tishi").html("确认密码不能为空");
        return false;
    }
    if (password != password2) {
        $("#add_tishi").html("输入密码不一致");
        return false;
    }
    $.ajax({
        type: "post",
        url: "../usdt/sysuser/SysUserUpdatePassword",
        async: true,
        dataType: "json",
        data: {
            password: password
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (info) {
            if (info.code == 100) {
                $("#tip-public-div").html("修改密码成功,5秒后将跳转登陆页面");
                $("#tip-public").show();
                var time = 5;
                var interval = setInterval(function () {
                    if (time <= 0) {
                        window.location.href = "login.html";
                    }

                    $("#tip-public-div").html("修改密码成功," + time + "秒后将跳转登陆页面");
                    time -= 1;
                }, 1000);
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);
        }
    })
}