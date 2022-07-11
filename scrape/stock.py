import pandas as pd
import ssl
import pandas_datareader as pdr
ssl._create_default_https_context = ssl._create_unverified_context


def get_stock(var1='TSLA', start=2000, end=2022):
    datas = pdr.get_data_yahoo(var1, start, end)
    print(datas)


get_stock()
