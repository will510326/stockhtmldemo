const chart1E1 = document.querySelector('#main');

let chart1 = echarts.init(chart1E1);

window.onresize = function () {
	chart1.resize();
};

$(document).ready(() => {
	drawkd();
});

function drawkd() {
    // chart1.showLoading();
    $.ajax({
        url: "/test1-json",
        type: "POST",
        dataType: "json",
        success: (a,b) => {
            // chart1.hideLoading();
            console.log(a);
            drawkdus(a);
        },
        error: () => {
            // chart1.hideLoading();
            alert("資料讀取失敗");
        }
    })

    function drawkdus(k, d) {
        var option;

        option = {
            title: {
                text: 'KD線'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {},
            toolbox: {
                show: true,
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    dataView: {
                        readOnly: false
                    },
                    magicType: {
                        type: ['line', 'bar']
                    },
                    restore: {},
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value} °C'
                }
            },
            series: [{
                    name: 'K',
                    type: 'line',
                    data: k,

                },
                {
                    name: 'D',
                    type: 'line',
                    data: d,
                }
            ]
        };

        option && chart1.setOption(option);
    }
}