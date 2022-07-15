from flask import Flask, render_template
from datetime import datetime
import json
from scrape.stock import get_US_stock

app = Flask(__name__)


@app.route('/stock-json', methods=['POST'])
def get_stock_json():
    columns, values = get_US_stock()
    # X軸
    datas = [value for value in values]
    data = []
    for i in range(len(datas)):
        data.append([datas[i][0].replace('-', '/'),
                    datas[i][3],
                    datas[i][4],
                    datas[i][2],
                    datas[i][1]])
    print(data)
    return json.dumps({'data': data}, ensure_ascii=False)


@ app.route('/stock-chart')
def stock_chart():
    return render_template('stock-chart.html')


@ app.route('/stock', methods=['GET', 'POST'])
def stock_data():
    # columns, values = get_tw_stock_datas()
    columns, values = get_US_stock()
    return render_template('stock.html', **locals())


@ app.route('/')
@ app.route('/<string:name>')
@ app.route('/index')  # 首頁
def index(name='GUEST'):
    time = get_time()
    content = {'name': name,
               'time': time}
    return render_template('index.html', **locals())


@ app.route('/time')
def get_time():
    return f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"


if __name__ == '__main__':
    app.run(debug=True)
    get_stock_json()
