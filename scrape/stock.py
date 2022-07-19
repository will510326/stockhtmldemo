import pandas as pd
import ssl
import pandas_datareader as pdr
ssl._create_default_https_context = ssl._create_unverified_context


# def get_name_stock(stock, start, end):
#     try:
#         df = pdr.get_data_yahoo(stock, start, end)
#         times = df.index.astype(str)
#         datas = []  # time
#         for t in times:
#             datas.append(t)
#         df_highest = df['High'].to_list()
#         df_lowest = df['Low'].to_list()
#         df_open = df['Open'].to_list()
#         df_Close = df['Close'].to_list()
#         df_vol = df['Volume'].to_list()
#         df_adj = df['Adj Close'].to_list()
#         values = []
#         for i in range(len(df_highest)):
#             values.append([datas[i], round(df_highest[i], 2), round(df_lowest[i], 2),
#                            round(df_open[i], 2), round(df_Close[i], 2), round(df_vol[i], 2), round(df_adj[i], 2)])
#         stock_datas = [value for value in values]
#         stock_data = []
#         for i in range(len(stock_datas)):
#             stock_data.append([stock_datas[i][0].replace('-', '/'),
#                                stock_datas[i][3],
#                                stock_datas[i][4],
#                                stock_datas[i][2],
#                                stock_datas[i][1],
#                                stock_datas[i][5]])
#     except Exception as e:
#         print(e)
#     return stock_data


def get_US_stock(stock='TSLA', start=2021, end=2023):
    try:
        df = pdr.get_data_yahoo(stock, start, end)
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
                               stock_datas[i][3],
                               stock_datas[i][4],
                               stock_datas[i][2],
                               stock_datas[i][1],
                               stock_datas[i][5]])
    except Exception as e:
        print(e)
    return stock_data


if __name__ == '__main__':
    get_US_stock()
