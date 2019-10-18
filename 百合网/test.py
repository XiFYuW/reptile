#__author: "YuWei"
#__date: 2018/2/5
import urllib3
import http
import requests
import requests.adapters
from http.client import RemoteDisconnected
import json
import time

req = requests.session()
requests.adapters.DEFAULT_RETRIES = 511
req.keep_alive = False

proxies = {"http": "http://211.151.58.5:80"}
headers = {'Host':'my.baihe.com',
'Proxy-Connection':'keep-alive',
'Referer':'http://my.baihe.com/login/?ReturnUrl=http%3A%2F%2Fsearch.baihe.com%2F',
'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:58.0) Gecko/20100101 Firefox/58.0'}
# .js
url_login = 'http://my.baihe.com/Getinterlogin/gotoLogin?jsonCallBack=?&event=3&spmp=4.20.87.257.1049&' \
                   'txtLoginEMail={}&txtLoginPwd={}'.format('xif_yuw@163.com','13974162858x')

login_json = ''
while login_json == '':
    try:
        login_json = req.get(url_login,headers=headers,proxies=proxies).text
    except requests.exceptions.ProxyError as e1:
        print(e1)
        time.sleep(5)
        continue
    except urllib3.exceptions.MaxRetryError as e2:
        print(e2)
    except http.client.RemoteDisconnected as e3:
        print(e3)
print(login_json)
# print(requests.utils.dict_from_cookiejar(req.cookies))
# url_miss = 'http://search.js.baihe.js.com/Search/getUserID?'
# params_miss = {"minAge": 18, "maxAge": 24, "minHeight": 155, "maxHeight": 175, "education": '1-8',
#                "income": '1-12', "city.js": 86, "hasPhoto": 1, "page": 1, "sorterField": 1}
# miss_json = req.post(url_miss,data=params_miss).text
# print(miss_json)
# print(requests.utils.dict_from_cookiejar(req.cookies))
# print(len(json.loads(miss_json)['data']))
# print(requests.utils.dict_from_cookiejar(req.cookies))
# ip代理
# req = requests.session()
# proxies = {"http": "http://192.168.200.1:8081"}
# headers = {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36'}
# # print(req.get('http://httpbin.org/get',headers=headers,proxies=proxies).text)
#
# r = requests.get('http://www.jiayuan.com/dynmatch/ajax/index_new.php',headers=headers,proxies=proxies)
# r.encoding='utf8'
# print(r.text)
# print(requests.get('http://www.baidu.com',proxies={'https':'https://192.168.200.1:808'}).status_code)