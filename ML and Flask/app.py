from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import requests, json
import datetime, time
from GoogleNews import GoogleNews
import pandas as pd
from datetime import datetime, timedelta
from pytz import timezone

app = Flask(__name__)

app.static_folder = 'static'
app.template_folder = 'templates'

CORS(app)


@app.route('/')
def index():
    return render_template('homepage.html')

@app.route('/home')
def home():
    return render_template('test.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/overview', methods = ['POST'])
def overview():
    request_data = request.get_json()
    symbol = request_data['symbol'].lower()

    with open('overview_dict.txt', 'r') as file:
        loaded_dict = json.load(file)

    result = {'data':loaded_dict[symbol]}
    return jsonify(result)


@app.route('/get-feeds')
def get_feeds():
    request_data = request.get_json()
    query = request_data['query']
    #GET A PERIOD OF TIME
    est = timezone('EST')
    today = datetime.now(est)
    yesterday = today - timedelta(days=1)

    print("Today's date:", today)
    print("Yesterday's  date:", yesterday)

    #SET THE DATE RANGE
    googlenews=GoogleNews(start=yesterday.strftime("%m-%d-%Y"),end=today.strftime("%m-%d-%Y"))
    #SET THE LANGUAGE
    googlenews.set_lang('en')
    #SET THE TOPIC
    googlenews.search(query)
    #GET THE NEWS
    result=googlenews.result()
    #CONVERT THE RESULT TO A PANDAS DATAFRAME
    df=pd.DataFrame(result)

    print(df)
    return result

@app.route('/history', methods=['POST'])
def history():
    request_data = request.get_json()
    symbol = request_data['symbol']
    interval = request_data['interval']
    limit = 2000

    candlesticks = requests.get(f"https://api.binance.com/api/v3/klines?symbol={symbol}&interval={interval}&limit={limit}")
    new_candles = json.loads(candlesticks.text)
    processed_candlesticks = []

    for data in new_candles:
        candlestick = { 
            "time": data[0] / 1000, 
            "open": data[1],
            "high": data[2], 
            "low": data[3], 
            "close": data[4]
        }

        processed_candlesticks.append(candlestick)
    
    return jsonify(processed_candlesticks)

if __name__ == '__main__':
    app.run(debug=True)