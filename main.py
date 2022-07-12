from distutils.log import debug
from flask import Flask, render_template
from datetime import datetime
import json
from scrape.stock import get_stock_data

app = Flask(__name__)


@app.route('/stock', methods=['GET', 'POST'])
def stock_data():
    columns, date, Highest, Lowest, Openprice, Closeprice, Vol, Adj_Close = get_stock_data(
        'TSLA')
    time = get_time()
    return render_template('stock.html', **locals())


@app.route('/')
@app.route('/<string:name>')
@app.route('/index')  # 首頁
def index(name='GUEST'):
    time = get_time()
    content = {'name': name,
               'time': time}
    return render_template('index.html', **locals())


@app.route('/time')
def get_time():
    return f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"


if __name__ == '__main__':
    app.run(debug=True)
