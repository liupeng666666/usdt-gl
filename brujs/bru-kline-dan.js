var kline_id = "";
jQuery(document).ready(function (a) {
    add_update();
});

function tiaoban() {
    load(index_url_y);
}

function add_update() {
    if (bru_kline != null) {
        $("#bk_open").val(bru_kline.open);
        $("#bk_close").val(bru_kline.close);
        $("#bk_low").val(bru_kline.low);
        $("#bk_high").val(bru_kline.high);
        $("#datetimepicker").val(bru_kline.showtime);
        kline_id = bru_kline.pid;
        $("#qd").attr("onclick", "qd_update()");
        bru_kline = null;
    }
}

function qd_add() {
    var bk_open = $("#bk_open").val();
    var bk_close = $("#bk_close").val();
    var bk_low = $("#bk_low").val();
    var bk_high = $("#bk_high").val();
    var showtime = $("#datetimepicker").val();
    if (bk_open == null) {
        public_tishi("开盘价不能为空");
        return false;
    }
    if (bk_close == null) {
        public_tishi("收盘价不能为空");
        return false;
    }
    if (bk_low == null) {
        public_tishi("最低价不能为空");
        return false;
    }
    if (bk_high == null) {
        public_tishi("最高价不能为空");
        return false;
    }
    if (showtime == null) {
        public_tishi("展示时间不能为空");
        return false;
    }
    $.ajax({
        type: "post",
        url: "../usdt/brukline/addBruKline",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            open: bk_open,
            close: bk_close,
            low: bk_low,
            high: bk_high,
            showtime: showtime
        },
        success: function (info) {
            if (info.code == 100) {
                tiaoban();
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}

function qd_update() {
    var bk_open = $("#bk_open").val();
    var bk_close = $("#bk_close").val();
    var bk_low = $("#bk_low").val();
    var bk_high = $("#bk_high").val();
    var showtime = $("#datetimepicker").val();

    if (bk_open == null) {
        public_tishi("买单价不能为空");
        return false;
    }
    if (bk_close == null) {
        public_tishi("卖单价不能为空");
        return false;
    }
    if (bk_low == null) {
        public_tishi("最低价不能为空");
        return false;
    }
    if (bk_high == null) {
        public_tishi("最高价不能为空");
        return false;
    }
    if (showtime == null) {
        public_tishi("展示时间不能为空");
        return false;
    }
    $.ajax({
        type: "post",
        url: "../usdt/brukline/changeBruKline",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            open: bk_open,
            close: bk_close,
            low: bk_low,
            high: bk_high,
            showtime: showtime,
            pid: kline_id
        },
        success: function (info) {
            if (info.code == 100) {
                tiaoban();
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });

}