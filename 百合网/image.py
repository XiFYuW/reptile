#__author: "YuWei"
#__date: 2018/2/9
import requests
import base64
import pymssql

url = 'http://photo3.baihe.com/2017/12/10/290_290/42656B9B8F6892B389933566997EBC0E.jpg'
data = requests.get(url).content
print(type(data),data)
# print(data.translate(b"\\",b"\\\\"))
# print(data.decode('utf8'))
# with open('1.jpg','wb') as f:
#     f.write(base64.b64decode(con))
conn = pymssql.connect(host='localhost', user='YUANWEI', password='13974162858x', database='Baihe',charset='utf8')
cur = conn.cursor()
sql = """insert into users values({},'{}',{},'{}','{}','{}',{},'{}','{}','{}','{}');""" \
    .format(1232312, 'sd', 21, '男','sd','dd',12,'没房', '没车','sd',data)#.encode('latin-1').decode('gbk')
print('sql: ', sql)
cur.execute(sql)
conn.commit()
cur.close()
conn.close()