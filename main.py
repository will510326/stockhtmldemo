from flask import Flask, render_template, request
from datetime import datetime
import json
from scrape.stock import get_US_stock, get_name_stock

app = Flask(__name__)


@app.route('/stock-json/<stock>/<start>/<end>', methods=['POST'])
def get_stockname_json(stock, start, end):
    data = get_name_stock(stock, start, end)
    return json.dumps({'data': data}, ensure_ascii=False)


@app.route('/stock-json', methods=['POST'])
def get_stock_json():
    data = get_US_stock()
    return json.dumps({'data': data}, ensure_ascii=False)


@app.route('/stock-bulma-chart')
def stock_bulma():
    return render_template('stock-bulma.html')


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
