select("", 1);

function select(value, page) {
    var num = parseInt(10);
    var start = (parseInt(page) - 1) * num;
    var name = $("#name").val();
    var state = $("#state").val();
    $.ajax({
        type: "post",
        url: "../usdt/bruuser/BobiSelect",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            page: start,
            num: num,
            name: name,
            state: state
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                system_news = info.bobi;
                for (var i in info.bobi) {
                    var bobi = info.bobi[i];
                    str += "<tr><td><input name=\"checkbox\" type=\"checkbox\" value=\"" + bobi.pid + "\"></td> ";
                    str += "<td><img src=\"" + bobi.img + "\" width=50 height=50 onerror='imgExists(this,0)'/></td>    ";
                    str += "<td >" + bobi.nickname + "</td>    ";
                    if (bobi.state == 0) {
                        str += "<td>拨币</td>";
                    } else {
                        str += "<td>拨活跃度</td>";
                    }

                    str += " <td>" + bobi.num + "</td>";
                    str += "<td>" + format(bobi.createtime, "yy/MM/dd HH:mm:ss") + "</td> ";
                    str += "</tr>";
                }
            } else {
                ajax_code(info.code);
            }
            $("#sys_center").html(str);
            center_fy("select", value, page, num, info.total);
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}