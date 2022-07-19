const chart1E1 = document.querySelector('#main');
const stockNameSite = document.querySelector('#stock_name_site'); // stock顯示名子
const stockNameTime = document.querySelector('#stock_name_time'); // stock顯示時間




$('#stock_btn').click(()=>{
	let stock = $('#stock_name').val();
	let start = $('#stock_start').val();
	let end = $('#stock_end').val();
	stockNameSite.innerText = stock;
	stockNameTime.innerText = `${start}~${end}`;
	draw_name_stock(stock, start, end);
}
);


let chart1 = echarts.init(chart1E1);

window.onresize = function () {
	chart1.resize();
};//自動調整圖片視窗大小
$(document).ready(() => {
	draw_stock();
}); //網頁整個渲染後才執行內部函式

//繪製stockfunction
function draw_stock() {
	chart1.showLoading();
	$.ajax({
		url: "/stock-json",
		type: "POST",
		dataType: "json",
		success: (data) => {
			chart1.hideLoading();
			drawchart1(data['data']);
		},
		error: () => {
			chart1.hideLoading();
			alert("資料讀取失敗");
		}
	})

	function drawchart1(data) {
		var option;

		const upColor = '#00da3c';
		const downColor = '#ec0000';

		function splitData(data) {
			let categoryData = [];
			let values = [];
			let volumes = [];
			for (let i = 0; i < data.length; i++) {
				categoryData.push(data[i].splice(0, 1)[0]);
				values.push(data[i]);
				volumes.push([i, data[i][4], data[i][0] > data[i][1] ? 1 : -1]);
			}
			return {
				categoryData: categoryData,
				values: values,
				volumes: volumes
			};
		}

		function calculateMA(dayCount, data) {
			var result = [];
			for (var i = 0, len = data.values.length; i < len; i++) {
				if (i < dayCount) {
					result.push('-');
					continue;
				}
				var sum = 0;
				for (var j = 0; j < dayCount; j++) {
					sum += data.values[i - j][1];
				}
				result.push(+(sum / dayCount).toFixed(3));
			}
			return result;
		}
		var data = splitData(data);
		chart1.setOption(
			(option = {
				animation: false,
				legend: {
					bottom: 10,
					left: 'center',
					data: ['Dow-Jones index', 'MA5', 'MA10', 'MA20', 'MA30']
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross'
					},
					borderWidth: 1,
					borderColor: '#ccc',
					padding: 10,
					textStyle: {
						color: '#000'
					},
					position: function (pos, params, el, elRect, size) {
						const obj = {
							top: 10
						};
						obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
						return obj;
					}
					// extraCssText: 'width: 170px'
				},
				axisPointer: {
					link: [{
						xAxisIndex: 'all'
					}],
					label: {
						backgroundColor: '#777'
					}
				},
				toolbox: {
					feature: {
						dataZoom: {
							yAxisIndex: false
						},
						brush: {
							type: ['lineX', 'clear']
						}
					}
				},
				brush: {
					xAxisIndex: 'all',
					brushLink: 'all',
					outOfBrush: {
						colorAlpha: 0.1
					}
				},
				visualMap: {
					show: false,
					seriesIndex: 5,
					dimension: 2,
					pieces: [{
							value: 1,
							color: downColor
						},
						{
							value: -1,
							color: upColor
						}
					]
				},
				grid: [{
						left: '10%',
						right: '8%',
						height: '50%'
					},
					{
						left: '10%',
						right: '8%',
						top: '63%',
						height: '16%'
					}
				],
				xAxis: [{
						type: 'category',
						data: data.categoryData,
						boundaryGap: false,
						axisLine: {
							onZero: false
						},
						splitLine: {
							show: false
						},
						min: 'dataMin',
						max: 'dataMax',
						axisPointer: {
							z: 100
						}
					},
					{
						type: 'category',
						gridIndex: 1,
						data: data.categoryData,
						boundaryGap: false,
						axisLine: {
							onZero: false
						},
						axisTick: {
							show: false
						},
						splitLine: {
							show: false
						},
						axisLabel: {
							show: false
						},
						min: 'dataMin',
						max: 'dataMax'
					}
				],
				yAxis: [{
						scale: true,
						splitArea: {
							show: true
						}
					},
					{
						scale: true,
						gridIndex: 1,
						splitNumber: 2,
						axisLabel: {
							show: false
						},
						axisLine: {
							show: false
						},
						axisTick: {
							show: false
						},
						splitLine: {
							show: false
						}
					}
				],
				dataZoom: [{
						type: 'inside',
						xAxisIndex: [0, 1],
						start: 98,
						end: 100
					},
					{
						show: true,
						xAxisIndex: [0, 1],
						type: 'slider',
						top: '85%',
						start: 98,
						end: 100
					}
				],
				series: [{
						name: 'Dow-Jones index',
						type: 'candlestick',
						data: data.values,
						itemStyle: {
							color: upColor,
							color0: downColor,
							borderColor: undefined,
							borderColor0: undefined
						},
						tooltip: {
							formatter: function (param) {
								param = param[0];
								return [
									'Date: ' + param.name + '<hr size=1 style="margin: 3px 0">',
									'Open: ' + param.data[0] + '<br/>',
									'Close: ' + param.data[1] + '<br/>',
									'Lowest: ' + param.data[2] + '<br/>',
									'Highest: ' + param.data[3] + '<br/>'
								].join('');
							}
						}
					},
					{
						name: 'MA5',
						type: 'line',
						data: calculateMA(5, data),
						smooth: true,
						lineStyle: {
							opacity: 0.5
						}
					},
					{
						name: 'MA10',
						type: 'line',
						data: calculateMA(10, data),
						smooth: true,
						lineStyle: {
							opacity: 0.5
						}
					},
					{
						name: 'MA20',
						type: 'line',
						data: calculateMA(20, data),
						smooth: true,
						lineStyle: {
							opacity: 0.5
						}
					},
					{
						name: 'MA30',
						type: 'line',
						data: calculateMA(30, data),
						smooth: true,
						lineStyle: {
							opacity: 0.5
						}
					},
					{
						name: 'Volume',
						type: 'bar',
						xAxisIndex: 1,
						yAxisIndex: 1,
						data: data.volumes
					}
				]
			}),
			true
		);
		chart1.dispatchAction({
			type: 'brush',
			areas: [{
				brushType: 'lineX',
				coordRange: ['2016-06-02', '2016-06-20'],
				xAxisIndex: 0
			}]
		});;

		option && chart1.setOption(option);
	}
}

function draw_name_stock(stock, start, end) {
	chart1.showLoading();
	$.ajax({
		url: `/stock-json/${stock}/${start}/${end}`,
		type: "POST",
		dataType: "json",
		success: (data) => {
			chart1.hideLoading();
			drawchart1(data['data']);
		},
		error: () => {
			chart1.hideLoading();
			alert("資料讀取失敗");
		}
	})

	function drawchart1(data) {
		var option;

		const upColor = '#00da3c';
		const downColor = '#ec0000';

		function splitData(data) {
			let categoryData = [];
			let values = [];
			let volumes = [];
			for (let i = 0; i < data.length; i++) {
				categoryData.push(data[i].splice(0, 1)[0]);
				values.push(data[i]);
				volumes.push([i, data[i][4], data[i][0] > data[i][1] ? 1 : -1]);
			}
			return {
				categoryData: categoryData,
				values: values,
				volumes: volumes
			};
		}

		function calculateMA(dayCount, data) {
			var result = [];
			for (var i = 0, len = data.values.length; i < len; i++) {
				if (i < dayCount) {
					result.push('-');
					continue;
				}
				var sum = 0;
				for (var j = 0; j < dayCount; j++) {
					sum += data.values[i - j][1];
				}
				result.push(+(sum / dayCount).toFixed(3));
			}
			return result;
		}
		var data = splitData(data);
		chart1.setOption(
			(option = {
				animation: false,
				legend: {
					bottom: 10,
					left: 'center',
					data: ['Dow-Jones index', 'MA5', 'MA10', 'MA20', 'MA30']
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross'
					},
					borderWidth: 1,
					borderColor: '#ccc',
					padding: 10,
					textStyle: {
						color: '#000'
					},
					position: function (pos, params, el, elRect, size) {
						const obj = {
							top: 10
						};
						obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
						return obj;
					}
					// extraCssText: 'width: 170px'
				},
				axisPointer: {
					link: [{
						xAxisIndex: 'all'
					}],
					label: {
						backgroundColor: '#777'
					}
				},
				toolbox: {
					feature: {
						dataZoom: {
							yAxisIndex: false
						},
						brush: {
							type: ['lineX', 'clear']
						}
					}
				},
				brush: {
					xAxisIndex: 'all',
					brushLink: 'all',
					outOfBrush: {
						colorAlpha: 0.1
					}
				},
				visualMap: {
					show: false,
					seriesIndex: 5,
					dimension: 2,
					pieces: [{
							value: 1,
							color: downColor
						},
						{
							value: -1,
							color: upColor
						}
					]
				},
				grid: [{
						left: '10%',
						right: '8%',
						height: '50%'
					},
					{
						left: '10%',
						right: '8%',
						top: '63%',
						height: '16%'
					}
				],
				xAxis: [{
						type: 'category',
						data: data.categoryData,
						boundaryGap: false,
						axisLine: {
							onZero: false
						},
						splitLine: {
							show: false
						},
						min: 'dataMin',
						max: 'dataMax',
						axisPointer: {
							z: 100
						}
					},
					{
						type: 'category',
						gridIndex: 1,
						data: data.categoryData,
						boundaryGap: false,
						axisLine: {
							onZero: false
						},
						axisTick: {
							show: false
						},
						splitLine: {
							show: false
						},
						axisLabel: {
							show: false
						},
						min: 'dataMin',
						max: 'dataMax'
					}
				],
				yAxis: [{
						scale: true,
						splitArea: {
							show: true
						}
					},
					{
						scale: true,
						gridIndex: 1,
						splitNumber: 2,
						axisLabel: {
							show: false
						},
						axisLine: {
							show: false
						},
						axisTick: {
							show: false
						},
						splitLine: {
							show: false
						}
					}
				],
				dataZoom: [{
						type: 'inside',
						xAxisIndex: [0, 1],
						start: 98,
						end: 100
					},
					{
						show: true,
						xAxisIndex: [0, 1],
						type: 'slider',
						top: '85%',
						start: 98,
						end: 100
					}
				],
				series: [{
						name: 'Dow-Jones index',
						type: 'candlestick',
						data: data.values,
						itemStyle: {
							color: upColor,
							color0: downColor,
							borderColor: undefined,
							borderColor0: undefined
						},
						tooltip: {
							formatter: function (param) {
								param = param[0];
								return [
									'Date: ' + param.name + '<hr size=1 style="margin: 3px 0">',
									'Open: ' + param.data[0] + '<br/>',
									'Close: ' + param.data[1] + '<br/>',
									'Lowest: ' + param.data[2] + '<br/>',
									'Highest: ' + param.data[3] + '<br/>'
								].join('');
							}
						}
					},
					{
						name: 'MA5',
						type: 'line',
						data: calculateMA(5, data),
						smooth: true,
						lineStyle: {
							opacity: 0.5
						}
					},
					{
						name: 'MA10',
						type: 'line',
						data: calculateMA(10, data),
						smooth: true,
						lineStyle: {
							opacity: 0.5
						}
					},
					{
						name: 'MA20',
						type: 'line',
						data: calculateMA(20, data),
						smooth: true,
						lineStyle: {
							opacity: 0.5
						}
					},
					{
						name: 'MA30',
						type: 'line',
						data: calculateMA(30, data),
						smooth: true,
						lineStyle: {
							opacity: 0.5
						}
					},
					{
						name: 'Volume',
						type: 'bar',
						xAxisIndex: 1,
						yAxisIndex: 1,
						data: data.volumes
					}
				]
			}),
			true
		);
		chart1.dispatchAction({
			type: 'brush',
			areas: [{
				brushType: 'lineX',
				coordRange: ['2016-06-02', '2016-06-20'],
				xAxisIndex: 0
			}]
		});;

		option && chart1.setOption(option);
	}
}


const chart2E2 = document.querySelector('#main2');
const stocktwNameSite = document.querySelector('#stocktw_name_site'); // stock顯示名子
const stocktwNameTime = document.querySelector('#stocktw_name_time'); // stock顯示時間




$('#stock_btn').click(()=>{
	let stock = $('#stocktw_name').val();
	let start = $('#stocktw_start').val();
	let end = $('#stocktw_end').val();
	stocktwNameSite.innerText = stock;
	stocktwNameTime.innerText = `${start}~${end}`;
	drawtw_name_stock(stock, start, end);
}
);


let chart2 = echarts.init(chart2E2);

window.onresize = function () {
	chart2.resize();
};//自動調整圖片視窗大小
$(document).ready(() => {
	drawtw_stock();
}); //網頁整個渲染後才執行內部函式

//繪製stockfunction
function drawtw_stock() {
	chart2.showLoading();
	$.ajax({
		url: "/stocktw-json",
		type: "POST",
		dataType: "json",
		success: (data) => {
			chart2.hideLoading();
			drawchart1(data['data']);
		},
		error: () => {
			chart2.hideLoading();
			alert("資料讀取失敗");
		}
	})

	function drawchart1(data) {
		var option;

		const upColor = '#00da3c';
		const downColor = '#ec0000';

		function splitData(data) {
			let categoryData = [];
			let values = [];
			let volumes = [];
			for (let i = 0; i < data.length; i++) {
				categoryData.push(data[i].splice(0, 1)[0]);
				values.push(data[i]);
				volumes.push([i, data[i][4], data[i][0] > data[i][1] ? 1 : -1]);
			}
			return {
				categoryData: categoryData,
				values: values,
				volumes: volumes
			};
		}

		function calculateMA(dayCount, data) {
			var result = [];
			for (var i = 0, len = data.values.length; i < len; i++) {
				if (i < dayCount) {
					result.push('-');
					continue;
				}
				var sum = 0;
				for (var j = 0; j < dayCount; j++) {
					sum += data.values[i - j][1];
				}
				result.push(+(sum / dayCount).toFixed(3));
			}
			return result;
		}
		var data = splitData(data);
		chart2.setOption(
			(option = {
				animation: false,
				legend: {
					bottom: 10,
					left: 'center',
					data: ['Dow-Jones index', 'MA5', 'MA10', 'MA20', 'MA30']
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross'
					},
					borderWidth: 1,
					borderColor: '#ccc',
					padding: 10,
					textStyle: {
						color: '#000'
					},
					position: function (pos, params, el, elRect, size) {
						const obj = {
							top: 10
						};
						obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
						return obj;
					}
					// extraCssText: 'width: 170px'
				},
				axisPointer: {
					link: [{
						xAxisIndex: 'all'
					}],
					label: {
						backgroundColor: '#777'
					}
				},
				toolbox: {
					feature: {
						dataZoom: {
							yAxisIndex: false
						},
						brush: {
							type: ['lineX', 'clear']
						}
					}
				},
				brush: {
					xAxisIndex: 'all',
					brushLink: 'all',
					outOfBrush: {
						colorAlpha: 0.1
					}
				},
				visualMap: {
					show: false,
					seriesIndex: 5,
					dimension: 2,
					pieces: [{
							value: 1,
							color: downColor
						},
						{
							value: -1,
							color: upColor
						}
					]
				},
				grid: [{
						left: '10%',
						right: '8%',
						height: '50%'
					},
					{
						left: '10%',
						right: '8%',
						top: '63%',
						height: '16%'
					}
				],
				xAxis: [{
						type: 'category',
						data: data.categoryData,
						boundaryGap: false,
						axisLine: {
							onZero: false
						},
						splitLine: {
							show: false
						},
						min: 'dataMin',
						max: 'dataMax',
						axisPointer: {
							z: 100
						}
					},
					{
						type: 'category',
						gridIndex: 1,
						data: data.categoryData,
						boundaryGap: false,
						axisLine: {
							onZero: false
						},
						axisTick: {
							show: false
						},
						splitLine: {
							show: false
						},
						axisLabel: {
							show: false
						},
						min: 'dataMin',
						max: 'dataMax'
					}
				],
				yAxis: [{
						scale: true,
						splitArea: {
							show: true
						}
					},
					{
						scale: true,
						gridIndex: 1,
						splitNumber: 2,
						axisLabel: {
							show: false
						},
						axisLine: {
							show: false
						},
						axisTick: {
							show: false
						},
						splitLine: {
							show: false
						}
					}
				],
				dataZoom: [{
						type: 'inside',
						xAxisIndex: [0, 1],
						start: 98,
						end: 100
					},
					{
						show: true,
						xAxisIndex: [0, 1],
						type: 'slider',
						top: '85%',
						start: 98,
						end: 100
					}
				],
				series: [{
						name: 'Dow-Jones index',
						type: 'candlestick',
						data: data.values,
						itemStyle: {
							color: upColor,
							color0: downColor,
							borderColor: undefined,
							borderColor0: undefined
						},
						tooltip: {
							formatter: function (param) {
								param = param[0];
								return [
									'Date: ' + param.name + '<hr size=1 style="margin: 3px 0">',
									'Open: ' + param.data[0] + '<br/>',
									'Close: ' + param.data[1] + '<br/>',
									'Lowest: ' + param.data[2] + '<br/>',
									'Highest: ' + param.data[3] + '<br/>'
								].join('');
							}
						}
					},
					{
						name: 'MA5',
						type: 'line',
						data: calculateMA(5, data),
						smooth: true,
						lineStyle: {
							opacity: 0.5
						}
					},
					{
						name: 'MA10',
						type: 'line',
						data: calculateMA(10, data),
						smooth: true,
						lineStyle: {
							opacity: 0.5
						}
					},
					{
						name: 'MA20',
						type: 'line',
						data: calculateMA(20, data),
						smooth: true,
						lineStyle: {
							opacity: 0.5
						}
					},
					{
						name: 'MA30',
						type: 'line',
						data: calculateMA(30, data),
						smooth: true,
						lineStyle: {
							opacity: 0.5
						}
					},
					{
						name: 'Volume',
						type: 'bar',
						xAxisIndex: 1,
						yAxisIndex: 1,
						data: data.volumes
					}
				]
			}),
			true
		);
		chart2.dispatchAction({
			type: 'brush',
			areas: [{
				brushType: 'lineX',
				coordRange: ['2016-06-02', '2016-06-20'],
				xAxisIndex: 0
			}]
		});;

		option && chart2.setOption(option);
	}
}

function drawtw_name_stock(stock, start, end) {
	chart2.showLoading();
	$.ajax({
		url: `/stocktw-json/${stock}/${start}/${end}`,
		type: "POST",
		dataType: "json",
		success: (data) => {
			chart2.hideLoading();
			drawchart1(data['data']);
		},
		error: () => {
			chart2.hideLoading();
			alert("資料讀取失敗");
		}
	})

	function drawchart1(data) {
		var option;

		const upColor = '#00da3c';
		const downColor = '#ec0000';

		function splitData(data) {
			let categoryData = [];
			let values = [];
			let volumes = [];
			for (let i = 0; i < data.length; i++) {
				categoryData.push(data[i].splice(0, 1)[0]);
				values.push(data[i]);
				volumes.push([i, data[i][4], data[i][0] > data[i][1] ? 1 : -1]);
			}
			return {
				categoryData: categoryData,
				values: values,
				volumes: volumes
			};
		}

		function calculateMA(dayCount, data) {
			var result = [];
			for (var i = 0, len = data.values.length; i < len; i++) {
				if (i < dayCount) {
					result.push('-');
					continue;
				}
				var sum = 0;
				for (var j = 0; j < dayCount; j++) {
					sum += data.values[i - j][1];
				}
				result.push(+(sum / dayCount).toFixed(3));
			}
			return result;
		}
		var data = splitData(data);
		chart2.setOption(
			(option = {
				animation: false,
				legend: {
					bottom: 10,
					left: 'center',
					data: ['Dow-Jones index', 'MA5', 'MA10', 'MA20', 'MA30']
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross'
					},
					borderWidth: 1,
					borderColor: '#ccc',
					padding: 10,
					textStyle: {
						color: '#000'
					},
					position: function (pos, params, el, elRect, size) {
						const obj = {
							top: 10
						};
						obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
						return obj;
					}
					// extraCssText: 'width: 170px'
				},
				axisPointer: {
					link: [{
						xAxisIndex: 'all'
					}],
					label: {
						backgroundColor: '#777'
					}
				},
				toolbox: {
					feature: {
						dataZoom: {
							yAxisIndex: false
						},
						brush: {
							type: ['lineX', 'clear']
						}
					}
				},
				brush: {
					xAxisIndex: 'all',
					brushLink: 'all',
					outOfBrush: {
						colorAlpha: 0.1
					}
				},
				visualMap: {
					show: false,
					seriesIndex: 5,
					dimension: 2,
					pieces: [{
							value: 1,
							color: downColor
						},
						{
							value: -1,
							color: upColor
						}
					]
				},
				grid: [{
						left: '10%',
						right: '8%',
						height: '50%'
					},
					{
						left: '10%',
						right: '8%',
						top: '63%',
						height: '16%'
					}
				],
				xAxis: [{
						type: 'category',
						data: data.categoryData,
						boundaryGap: false,
						axisLine: {
							onZero: false
						},
						splitLine: {
							show: false
						},
						min: 'dataMin',
						max: 'dataMax',
						axisPointer: {
							z: 100
						}
					},
					{
						type: 'category',
						gridIndex: 1,
						data: data.categoryData,
						boundaryGap: false,
						axisLine: {
							onZero: false
						},
						axisTick: {
							show: false
						},
						splitLine: {
							show: false
						},
						axisLabel: {
							show: false
						},
						min: 'dataMin',
						max: 'dataMax'
					}
				],
				yAxis: [{
						scale: true,
						splitArea: {
							show: true
						}
					},
					{
						scale: true,
						gridIndex: 1,
						splitNumber: 2,
						axisLabel: {
							show: false
						},
						axisLine: {
							show: false
						},
						axisTick: {
							show: false
						},
						splitLine: {
							show: false
						}
					}
				],
				dataZoom: [{
						type: 'inside',
						xAxisIndex: [0, 1],
						start: 98,
						end: 100
					},
					{
						show: true,
						xAxisIndex: [0, 1],
						type: 'slider',
						top: '85%',
						start: 98,
						end: 100
					}
				],
				series: [{
						name: 'Dow-Jones index',
						type: 'candlestick',
						data: data.values,
						itemStyle: {
							color: upColor,
							color0: downColor,
							borderColor: undefined,
							borderColor0: undefined
						},
						tooltip: {
							formatter: function (param) {
								param = param[0];
								return [
									'Date: ' + param.name + '<hr size=1 style="margin: 3px 0">',
									'Open: ' + param.data[0] + '<br/>',
									'Close: ' + param.data[1] + '<br/>',
									'Lowest: ' + param.data[2] + '<br/>',
									'Highest: ' + param.data[3] + '<br/>'
								].join('');
							}
						}
					},
					{
						name: 'MA5',
						type: 'line',
						data: calculateMA(5, data),
						smooth: true,
						lineStyle: {
							opacity: 0.5
						}
					},
					{
						name: 'MA10',
						type: 'line',
						data: calculateMA(10, data),
						smooth: true,
						lineStyle: {
							opacity: 0.5
						}
					},
					{
						name: 'MA20',
						type: 'line',
						data: calculateMA(20, data),
						smooth: true,
						lineStyle: {
							opacity: 0.5
						}
					},
					{
						name: 'MA30',
						type: 'line',
						data: calculateMA(30, data),
						smooth: true,
						lineStyle: {
							opacity: 0.5
						}
					},
					{
						name: 'Volume',
						type: 'bar',
						xAxisIndex: 1,
						yAxisIndex: 1,
						data: data.volumes
					}
				]
			}),
			true
		);
		chart2.dispatchAction({
			type: 'brush',
			areas: [{
				brushType: 'lineX',
				coordRange: ['2016-06-02', '2016-06-20'],
				xAxisIndex: 0
			}]
		});;

		option && chart2.setOption(option);
	}
}