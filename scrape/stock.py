import pandas as pd
import ssl
import pandas_datareader as pdr
from regex import E
import talib
ssl._create_default_https_context = ssl._create_unverified_context

def get_US_kd(stock='TSLA', start=2021, end=2023):
    try:
        df = pdr.get_data_yahoo(stock, start, end)
        df['k'], df['d'] = talib.STOCH(df['High'], df['Low'], df['Close'], fastk_period=9, slowk_period=3,slowk_matype=1, slowd_period=3, slowd_matype=1)
        df_k = df['k'].to_list()
        df_d = df['d'].to_list()
        times = df.index.astype(str)
        datas = []  # time
        for t in times:
            datas.append(t)

        if df_k and df_d:
            for i in range(12):
                df_k.pop(0)
                df_d.pop(0)

        k_datas = []
        for i in range(len(df_k)):
            k_datas.append(round(df_k[i], 2))
        d_datas = []
        for i in range(len(df_d)):
            d_datas.append(round(df_d[i], 2))
    except Exception as e:
        print(e)
    return datas, k_datas, d_datas

def get_TW_stock(stock='2330', start=2022, end=2023):
    try:
        df = pdr.DataReader(stock+'.tw', 'yahoo', start, end)
        times = df.index.astype(str)
        datas = []  # time
        for t in times:
            datas.append(t)
        df_highest = df['High'].to_list()
        df_lowest = df['Low'].to_list()
        df_open = df['Open'].to_list()
        df_Close = df['Close'].to_list()
        df_vol = df['Volume'].to_list()
        df_adj = df['Adj Close'].to_list()
        values = []
        for i in range(len(df_highest)):
            values.append([datas[i], round(df_highest[i], 2), round(df_lowest[i], 2),
                           round(df_open[i], 2), round(df_Close[i], 2), round(df_vol[i], 2), round(df_adj[i], 2)])
        stocktw_datas = [value for value in values]
        stocktw_data = []
        for i in range(len(stocktw_datas)):
            stocktw_data.append([stocktw_datas[i][0].replace('-', '/'),
                                 stocktw_datas[i][3],
                                 stocktw_datas[i][4],
                                 stocktw_datas[i][2],
                                 stocktw_datas[i][1],
                                 stocktw_datas[i][5]])
    except Exception as e:
        print(e)
    return stocktw_data


def get_US_stock(stock='TSLA', start=2021, end=2023):
    try:
        df = pdr.get_data_yahoo(stock, start, end)
        df['k'], df['d'] = talib.STOCH(df['High'], df['Low'], df['Close'], fastk_period=9, slowk_period=3,
                                       slowk_matype=1, slowd_period=3, slowd_matype=1)
        times = df.index.astype(str)
        datas = []  # time
        for t in times:
            datas.append(t)
        df_highest = df['High'].to_list()
        df_lowest = df['Low'].to_list()
        df_open = df['Open'].to_list()
        df_Close = df['Close'].to_list()
        df_vol = df['Volume'].to_list()
        df_adj = df['Adj Close'].to_list()


        values = []
        for i in range(len(df_highest)):
            values.append([datas[i], round(df_highest[i], 2), round(df_lowest[i], 2),
                           round(df_open[i], 2), round(df_Close[i], 2), round(df_vol[i], 2), round(df_adj[i], 2)])
        stock_datas = [value for value in values]
        stock_data = []
        for i in range(len(stock_datas)):
            stock_data.append([stock_datas[i][0].replace('-', '/'),
                               stock_datas[i][3],  # open
                               stock_datas[i][4],  # close
                               stock_datas[i][2],  # lowest
                               stock_datas[i][1],  # highest
                               stock_datas[i][5]])  # volumn
    except Exception as e:
        print(e)
    return stock_data


if __name__ == '__main__':
    get_US_stock()
    get_TW_stock()
