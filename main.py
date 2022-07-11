from distutils.log import debug
from flask import Flask, render_template
from datetime import datetime
import json

app = Flask(__name__)


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
