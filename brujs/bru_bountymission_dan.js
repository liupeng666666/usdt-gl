var au_taskid = '';
jQuery(document).ready(function (a) {
    add_update();
});

function tiaoban() {
    load(index_url_y);
}

function qd_add() {
    var level = $("#level").val();
    var tasktitle = $("#tasktitle").val();
    var taskcontent = $("#taskcontent").val();
    var money = $("#money").val();
    var channel = "";
    $("input[name='channel']:checked").each(function (index, item) {
        channel += $(this).val() + ",";
    });
    channel = channel.substring(0, channel.lastIndexOf(','));
    var state = $("input[name='state']:checked").val();
    if (tasktitle == null) {
        public_tishi("标题不能为空");
        return false;
    }
    if (taskcontent == null) {
        public_tishi("任务内容不能为空");
        return false;
    }
    if (money == null) {
        public_tishi("任务赏金不能为空");
        return false;
    }
    if (channel == null) {
        public_tishi("任务渠道不能为空");
        return false;
    }
    $.ajax({
        type: "post",
        url: "../usdt/bountymission/addBountyMission",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            tasktitle: tasktitle,
            taskcontent: taskcontent,
            level: level,
            money: money,
            channel: channel,
            state: state
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


function add_update() {
    if (bounty_mission != null) {
        $("#level option[value='" + bounty_mission.level + "']").attr("selected", "selected");
        $("#tasktitle").val(bounty_mission.tasktitle);
        $("#taskcontent").val(bounty_mission.taskcontent);
        $("#money").val(bounty_mission.money);
        var channel = bounty_mission.channel.split(",");
        for (var i = 0; i < channel.length; i++) {
            $("input[value='" + channel + "']").prop("checked", true);
        }
        au_taskid = bounty_mission.taskid;
        console.info(bounty_mission);
        $("#qd").attr("onclick", "qd_update()");
        bounty_mission = null;
    }
}

function qd_update() {
    var level = $("#level").val();
    var tasktitle = $("#tasktitle").val();
    var taskcontent = $("#taskcontent").val();
    var money = $("#money").val();
    var channel = "";
    $("input[name='channel']:checked").each(function (index, item) {
        channel += $(this).val() + ",";
    });
    channel = channel.substring(0, channel.lastIndexOf(','));
    var state = $("input[name='state']:checked").val();
    if (tasktitle == null) {
        public_tishi("标题不能为空");
        return false;
    }
    if (taskcontent == null) {
        public_tishi("任务内容不能为空");
        return false;
    }
    if (money == null) {
        public_tishi("任务赏金不能为空");
        return false;
    }
    if (channel == null) {
        public_tishi("任务渠道不能为空");
        return false;
    }
    $.ajax({
        type: "post",
        url: "../usdt/bountymission/changeBountyMission",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            taskid: au_taskid,
            tasktitle: tasktitle,
            taskcontent: taskcontent,
            level: level,
            money: money,
            channel: channel,
            state: state
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