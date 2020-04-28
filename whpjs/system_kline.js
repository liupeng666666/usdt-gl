var system_currency;
var currency_id;
var datetime;
var currency_name;
var kline_date = new Array();
var kline_values = new Array();
currency_select();

function currency_select() {
    $.ajax({
        type: "post",
        url: "../usdt/syscurrency/SysCurrency",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                system_currency = info.currency;
                for (var i in info.currency) {
                    var sys_currency = info.currency[i];
                    if (i == 0) {
                        currency_id = sys_currency.pid;
                        currency_name = sys_currency.name;
                        kline_select();
                        str += "<li class=\"active\" name='z-ul-li' onclick='class_qh(\"" + sys_currency.pid + "\",this)'><a href=\"javascript:void(0)\">" + sys_currency.name + "</a></li>";
                    } else {
                        str += "<li name='z-ul-li' onclick='class_qh(\"" + sys_currency.pid + "\",this)'><a href=\"javascript:void(0)\">" + sys_currency.name + "</a></li>";

                    }

                }
                $("#top-class").html(str);
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}

function class_qh(pid, th) {
    currency_id = pid;
    $("[name='z-ul-li']").removeClass("active");
    $(th).addClass("active");
    kline_select();
    datetime = "";
}

function kline_select() {
    $('#loding').shCircleLoader({
        color: '#8600FF'
    });
    $.ajax({
        type: "post",
        url: "../usdt/syskline/SysKlineSelectQ",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            sys_currency_id: currency_id, createtime: datetime
        },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                for (var i in info.kline) {
                    var kline = info.kline[i];
                    var str = "<tr><td><input name=\"checkbox\" type=\"checkbox\" value=\"" + kline.pid + "\"></td>";
                    str += "<td>" + kline.amount + "</td>";
                    str += "<td>" + kline.count + "</td>";
                    str += "<td>" + kline.open + "</td>";
                    str += "<td>" + kline.close + "</td>";
                    str += "<td>" + kline.low + "</td>";
                    str += "<td>" + kline.high + "</td>";
                    str += "<td>" + kline.vol + "</td>";
                    str += "<td>" + format(kline.createtime, "yy/MM/dd HH:mm:ss") + "</td></tr>";
                    kline_date.push(format(kline.createtime, "yy/MM/dd HH:mm:ss"));
                    var kline_shuju = new Array();
                    kline_shuju.push(kline.open);
                    kline_shuju.push(kline.close);
                    kline_shuju.push(kline.high);
                    kline_shuju.push(kline.low);
                    kline_values.push(kline_shuju);
                    $("table #kline_center").prepend(str);

                }
                console.info(kline_values);
                echart_tb();
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}

function dj(state) {
    if (state == 1) {
        $("#echart").hide();
        $("#title").show();
    } else {
        $("#echart").show();
        $("#title").hide();
    }


}


function echart_tb() {
    var dom = document.getElementById("container");
    var myChart = echarts.init(dom);
    var app = {};
    option = null;
    var upColor = '#ec0000';
    var upBorderColor = '#8A0000';
    var downColor = '#00da3c';
    var downBorderColor = '#008F28';


    function calculateMA(dayCount) {
        var result = [];
        for (var i = 0, len = kline_values.length; i < len; i++) {
            if (i < dayCount) {
                result.push('-');
                continue;
            }
            var sum = 0;
            for (var j = 0; j < dayCount; j++) {
                sum += kline_values[i - j][1];
            }
            result.push(sum / dayCount);
        }
        return result;
    }


    option = {
        title: {
            text: currency_name,
            left: 0
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        legend: {
            data: ['1分钟', '5分钟', '15分钟', '30分钟', '1小时']
        },
        grid: {
            left: '10%',
            right: '10%',
            bottom: '15%'
        },
        xAxis: {
            type: 'category',
            data: kline_date,
            scale: true,
            boundaryGap: false,
            axisLine: {onZero: false},
            splitLine: {show: false},
            splitNumber: 20,
            min: 'dataMin',
            max: 'dataMax'
        },
        yAxis: {
            scale: true,
            splitArea: {
                show: true
            }
        },
        dataZoom: [
            {
                type: 'inside',
                start: 99,
                end: 100
            },
            {
                show: true,
                type: 'slider',
                y: '90%',
                start: 99,
                end: 100
            }
        ],
        series: [
            {
                name: '1分钟',
                type: 'candlestick',
                data: kline_values,
                itemStyle: {
                    normal: {
                        color: upColor,
                        color0: downColor,
                        borderColor: upBorderColor,
                        borderColor0: downBorderColor
                    }
                },
                markPoint: {
                    label: {
                        normal: {
                            formatter: function (param) {
                                return param != null ? Math.round(param.value) : '';
                            }
                        }
                    },
                    data: [
                        {
                            name: 'XX标点',
                            coord: ['2013/5/31', 2300],
                            value: 2300,
                            itemStyle: {
                                normal: {color: 'rgb(41,60,85)'}
                            }
                        },
                        {
                            name: 'highest value',
                            type: 'max',
                            valueDim: 'highest'
                        },
                        {
                            name: 'lowest value',
                            type: 'min',
                            valueDim: 'lowest'
                        },
                        {
                            name: 'average value on close',
                            type: 'average',
                            valueDim: 'close'
                        }
                    ],
                    tooltip: {
                        formatter: function (param) {
                            return param.name + '<br>' + (param.data.coord || '');
                        }
                    }
                },
                markLine: {
                    symbol: ['none', 'none'],
                    data: [
                        [
                            {
                                name: 'from lowest to highest',
                                type: 'min',
                                valueDim: 'lowest',
                                symbol: 'circle',
                                symbolSize: 10,
                                label: {
                                    normal: {show: false},
                                    emphasis: {show: false}
                                }
                            },
                            {
                                type: 'max',
                                valueDim: 'highest',
                                symbol: 'circle',
                                symbolSize: 10,
                                label: {
                                    normal: {show: false},
                                    emphasis: {show: false}
                                }
                            }
                        ],
                        {
                            name: 'min line on close',
                            type: 'min',
                            valueDim: 'close'
                        },
                        {
                            name: 'max line on close',
                            type: 'max',
                            valueDim: 'close'
                        }
                    ]
                }
            },
            {
                name: '5分钟',
                type: 'line',
                data: calculateMA(5),
                smooth: true,
                lineStyle: {
                    normal: {opacity: 0.5}
                }
            },
            {
                name: '15分钟',
                type: 'line',
                data: calculateMA(15),
                smooth: true,
                lineStyle: {
                    normal: {opacity: 0.5}
                }
            },
            {
                name: '30分钟',
                type: 'line',
                data: calculateMA(30),
                smooth: true,
                lineStyle: {
                    normal: {opacity: 0.5}
                }
            },
            {
                name: '1小时',
                type: 'line',
                data: calculateMA(60),
                smooth: true,
                lineStyle: {
                    normal: {opacity: 0.5}
                }
            },

        ]
    };
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}

