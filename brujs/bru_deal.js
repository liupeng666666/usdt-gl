var search = "";
var bru_user;
var c_state;
var bdstate = '';
var bru_deal;
var deal_nid;

getUserDeal("", 1);

function class_bd(pid, th) {
    bdstate = pid;
    $("[name='z-ul-li']").removeClass("active");
    $(th).addClass("active");
    getUserDeal("", 1);
}

function getUserDeal(value, page) {
    search = $("#search_content").val();
    var num = parseInt(10);
    var start = (parseInt(page) - 1) * num;
    $
        .ajax({
            type: "POST",
            url: "../usdt/brudeal/getBruDealByPage",
            async: true,
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', token);
            },
            data: {
                search: search,
                state: bdstate,
                start: start,
                num: num
            },
            success: function (info) {
                var str = "";
                if (info.code == 100) {
//						bru_user = info.user;
                    bru_deal = info.deal;
                    for (var i in info.deal) {
                        var user = info.deal[i];
                        str += "<tr><td><input name=\"checkbox\" type=\"checkbox\" value=\""
                            + user.id + "\"></td> ";
                        str += "<td>" + unde(user.orderid) + "</td>";
                        str += "<td>" + unde(user.nickname) + "</td>";
                        str += "<td>" + unde(user.phone) + "</td>";
                        str += "<td>" + unde(user.bnickname) + "</td>";
                        str += "<td>" + unde(user.bphone) + "</td>";
                        str += "<td>" + unde(user.sellnum) + "</td>";
                        str += "<td>" + unde(user.sellprice) + "</td>";
                        str += "<td>" + unde(user.sellnum) + "</td>";
                        str += "<td>" + unde(user.createtime) + "</td>";
                        str += "<td>" + unde(user.buytime) + "</td>";
                        str += "<td>" + unde(user.paytime) + "</td>";

                        if (user.state == 0) {
                            str += "<td>待购买</td>";
                        } else if (user.state == 1) {
                            str += "<td>待付款</td>";
                        } else if (user.state == 2) {
                            str += "<td>待收款</td>";
                        } else if (user.state == 3) {
                            str += "<td>已取消</td>";
                        } else if (user.state == 4) {
                            str += "<td>已完成</td>";
                        } else if (user.state == 5) {
                            str += "<td>待发币</td>";
                        } else if (user.state == 6) {
                            str += "<td>超时</td>";
                        } else if (user.state == 7) {
                            str += "<td>超时取消</td>";
                        }
                        if (user.outid == 1) {
                            str += "<td>付款超时</td>";
                            str += "<td>" + unde(user.phone) + "</td>";
                            str += "<td><button type='button' class='btn btn-info' onclick='update(\"" + user.id + "\",1)'>操作</button></td>";
                        } else if (user.outid == 2) {
                            str += "<td>收款超时</td>";
                            str += "<td>" + unde(user.bphone) + "</td>";
                            str += "<td><button type='button' class='btn btn-info' onclick='update(\"" + user.id + "\",2)'>操作</button></td>";
                        } else if (user.outid == 3) {
                            str += "<td>发币超时</td>";
                            str += "<td>" + unde(user.bphone) + "</td>";
                            str += "<td><button type='button' class='btn btn-info' onclick='update(\"" + user.id + "\",2)'>操作</button></td>";
                        } else {
                            str += "<td></td>";
                            str += "<td></td>";
                            str += "<td></td>";
                        }
                        str += "</tr>";
                    }
                    $("#user_center").html(str);
                    center_fy("getUserDeal", value, page, num,
                        info.count);
                } else {
                    $("#user_center").html("");
                    center_fy("getUserDeal", value, page, num, 0);
                }
            },
            error: function (err) {
                ajax_code(500);

            }
        });
}

function del(state) {
    t = check(2);
    if (t != false) {
        del_state = state;
        if (state == 2) {
            $("#myModalLabelDel").html("删除");
            $("#myModalLabelN").html("确定要删除？");
        } else if (state == 1) {
            $("#myModalLabelDel").html("开启/冻结");
            $("#myModalLabelN").html("确定要冻结？");
        } else {
            $("#myModalLabelDel").html("开启/冻结");
            $("#myModalLabelN").html("确定要开启？");
        }
        $("#delFile").modal("show");
    }
}

function qd_del() {
    $.ajax({
        type: "POST",
        url: "../usdt/brudeal/delUserDeal",
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
                getUserDeal("", 1);
                $("#delFile").modal("hide");
            } else {
                ajax_code(info.code);
            }

        },
        error: function (err) {
            ajax_code(500);

        }
    });
}

function update(dealid, ds) {
    for (var i in bru_deal) {
        var user = bru_deal[i];
        if (dealid == user.id) {
            deal_nid = dealid;
            $("#deal_id").val(unde(user.orderid));
            $("#deal_nickname").val(unde(user.nickname));
            $("#deal_phone").val(unde(user.phone));
            $("#deal_bnickname").val(unde(user.bnickname));
            $("#deal_bphone").val(unde(user.bphone));
            $("#deal_sellnum").val(unde(user.sellnum));
            $("#deal_sellprice").val(unde(user.sellprice));
            $("#deal_alive").val(unde(user.sellnum));
            $("#deal_createtime").val(unde(user.createtime));
            $("#deal_buytime").val(unde(user.buytime));
            $("#deal_paytime").val(unde(user.paytime));
            if (user.outid == 1) {
                $("#deal_state").val("付款超时");
            } else if (user.outid == 2) {
                $("#deal_state").val("收款超时");
            } else if (user.outid == 3) {
                $("#deal_state").val("发币超时");
            } else {
                $("#deal_state").val("");
            }
            console.log(user)
            $("#img1").attr("src", user.payimg);
//			if(ds==1){
            $("#process").empty();
            var str = "<option value='7'>取消订单</option>";
            str += "<option value='4'>发币</option>";
            $("#process").append(str);
            $("#process").removeAttr("disabled");
//			}else{
//				$("#process").empty();
//				var str ="<option value='4'>发币</option>";
//				$("#process").append(str);
//				$("#process").removeAttr("disabled");
//			}

            $("#fileStorage").modal("show");
        }
    }
}

function qd_update() {
    var process_code = $("#process").val();
    $.ajax({
        type: "POST",
        url: "../usdt/brudeal/timeoutDealCL",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            id: deal_nid,
            state: process_code
        },
        success: function (info) {
            if (info.code == 100) {
                $("#fileStorage").modal("hide");
                getUserDeal("", 1);
            } else {
                ajax_code(info.code);
            }

        },
        error: function (err) {
            ajax_code(500);

        }
    });
}