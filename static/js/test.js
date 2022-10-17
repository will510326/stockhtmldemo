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
        url: "/stock-kd-json",
        type: "POST",
        dataType: "json",
        success: (data) => {
            // chart1.hideLoading();
            console.log(data);
            drawkdus(data['time'],data['datas_k'],data['datas_d']);
        },
        error: (data) => {
            // chart1.hideLoading();
            alert("資料讀取失敗");
            console.log(data)
        }
    })

    function drawkdus(time, k, d) {
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
                data: time
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value}'
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