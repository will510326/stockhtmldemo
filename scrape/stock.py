import pandas as pd
import ssl
import pandas_datareader as pdr
ssl._create_default_https_context = ssl._create_unverified_context


def get_US_stock():
    df = pdr.get_data_yahoo('TSLA', 2022, 2023)
    times = df.index.astype(str)
    columns = [	'Date', 'High'	, 'Low'	, 'Open'	,
                'Close'	, 'Volume'	, 'Adj Close']
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
    return columns, values


if __name__ == '__main__':
    get_US_stock()
