import pandas as pd
import ssl
import pandas_datareader as pdr
ssl._create_default_https_context = ssl._create_unverified_context


def get_stock_data(stock, start=2022, end=2023):
    datas = []
    try:
        df = pdr.get_data_yahoo(stock, start, end)
        columns = df.columns  # 欄位
        date = df.index #日期
        Highest = df['High'].values  # 最高價
        Lowest = df['Low'].values  # 最低價
        Openprice = df['Open'].values  # 開盤價
        Closeprice = df['Close'].values  # 收盤價
        Vol = df['Volume'].values  # 成交量
        Adj_Close = df['Adj Close'].values  # 調整後收盤價
        datas.append([date, Highest, Lowest, Openprice,
                     Closeprice, Vol, Adj_Close])
    except Exception as e:
        print(e)
    return columns,datas


if __name__ == '__main__':
    get_stock_data('TSLA')
