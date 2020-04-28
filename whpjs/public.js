function check(state) {
    var pid_array = new Array();
    var str = $("input[name='checkbox']");
    var objarray = str.length;
    var chestr = 0;
    var pid;
    for (i = 0; i < objarray; i++) {
        if (str[i].checked == true) {
            pid = str[i].value;
            chestr += 1;
            pid_array.push(pid);
        }
    }
    if (state == 1) {
        if (chestr != 1) {
            $("#tip-public-div").html("修改只能勾选一条记录！");
            $("#tip-public").show();
            return false;
        }
    } else if (state == 2) {
        if (chestr == 0) {
            $("#tip-public-div").html("删除不能少于一条记录！");
            $("#tip-public").show();
            return false;
        }
    } else if (state == 3) {
        if (chestr == 0) {
            $("#tip-public-div").html("启用不能少于一条记录！");
            $("#tip-public").show();
            return false;
        }
    } else if (state == 4) {
        if (chestr == 0) {
            $("#tip-public-div").html("禁止不能少于一条记录！");
            $("#tip-public").show();
            return false;
        }
    } else if (state == 5) {
        if (chestr == 0) {
            $("#tip-public-div").html("更新不能少于一条记录！");
            $("#tip-public").show();
            return false;
        }
    }
    return pid_array;
}

function public_tishi(message) {
    $("#tip-public-div").html(message);
    $("#tip-public").show();
}

function unde(value) {
    if (typeof (value) == "undefined") {
        return "";
    } else {
        return value;
    }

}

function format(value, str) {
    if (value == null || value == "" || typeof (value) == "undefined") {
        return "";
    }
    var date = new Date(value);
    var mat = {};
    mat.M = date.getMonth() + 1;//月份记得加1
    mat.H = date.getHours();
    mat.s = date.getSeconds();
    mat.m = date.getMinutes();
    mat.Y = date.getFullYear();
    mat.D = date.getDate();
    mat.d = date.getDay();//星期几
    mat.d = check_date(mat.d);
    mat.H = check_date(mat.H);
    mat.M = check_date(mat.M);
    mat.D = check_date(mat.D);
    mat.s = check_date(mat.s);
    mat.m = check_date(mat.m);
    if (str.indexOf(":") > -1) {
        mat.Y = mat.Y.toString().substr(2, 2);
        return mat.Y + "/" + mat.M + "/" + mat.D + " " + mat.H + ":" + mat.m + ":" + mat.s;
    }
    if (str.indexOf("/") > -1) {
        return mat.Y + "/" + mat.M + "/" + mat.D + " " + mat.H + "/" + mat.m + "/" + mat.s;
    }
    if (str.indexOf("-") > -1) {
        return mat.Y + "-" + mat.M + "-" + mat.D + " " + mat.H + ":" + mat.m + ":" + mat.s;
    }
}

//检查是不是两位数字，不足补全
function check_date(str) {
    str = str.toString();
    if (str.length < 2) {
        str = '0' + str;
    }
    return str;
}

function center_fy(on, value, page, end, count) {
    $("#dynamic-table_info").html("共" + count + "条记录," + page + "/" + Math.ceil(count / end) + "页");
    var page1 = 1;
    var page2 = 1;
    if (page == 1) {
        page1 == 1;
    } else {
        page1 = parseInt(page) - 1;
    }
    if (page == Math.ceil(count / end)) {
        page2 = page;
    } else {
        page2 = parseInt(page) + 1;
    }
    var str = "<li class=\"page-first\"><a href=\"javascript:void(0)\" onclick='" + on + "(\"" + value + "\",1)'>首页</a></li>";
    str += "<li class=\"page-pre\"><a href=\"javascript:void(0)\" onclick='" + on + "(\"" + value + "\"," + page1 + ")'>上一页</a></li> ";
    str += "<li class=\"page-next\"><a href=\"javascript:void(0)\" onclick='" + on + "(\"" + value + "\"," + page2 + ")'>下一页</a></li>";
    str += "<li class=\"page-last\"><a href=\"javascript:void(0)\" onclick='" + on + "(\"" + value + "\"," + Math.ceil(count / end) + ")'>末页</a></li>";
    str += "<li class=\"pagejump\">第<input name=\"\" type=\"number\" id=\"ymdz\" min='1' max='" + Math.ceil(count / end) + "'\">/" + Math.ceil(count / end) + "页 <a href=\"javascript:void(0)\" onclick='" + on + "(\"" + value + "\",document.getElementById(\"ymdz\").value)'>GO</a></li>";
    $("#center_fy").html(str);
}


function ajax_code(code) {
    console.info("code:" + code);
    if (code == 401) {
        window.location.href = "login.html";
    } else {
        $("#tip-public-div").html("服务器外出了,请刷新,如还是不行,请联系技术团队");
        $("#tip-public").show();

    }

}

function imgExists(e, state) {
    //默认图片
    var imgUrl = "";
    if (state == 0) {
        imgUrl = "images/avatar.png";
    } else if (state == 1) {
        imgUrl = "img/timg.jpg";
    } else if (state == 2) {
        imgUrl = "../img/head.png";
    } else if (state == 3) {
        imgUrl = "images/bch.png";
    }
    var img = new Image();
    img.src = imgUrl;
    //判断图片大小是否大于0 或者 图片高度与宽度都大于0
    if (img.filesize > 0 || (img.width > 0 && img.height > 0)) {
        e.src = imgUrl;
    } else {
        //默认图片也不存在的时候
    }
}
