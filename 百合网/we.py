#__author: "YuWei"
#__date: 2018/2/4
import requests
import time
import pymssql
import os

# 8个人为一组，该常量用于判断列表的长度是否与网站一致
FING_INDEX = 8
# 请求头，伪装成浏览器
HEADERS = {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:58.0) Gecko/20100101 Firefox/58.0'}
# 代理ip，防止被百合网封ip
HTTP_IP_PROXIES_1 = 'http://211.151.58.5:80'
HTTP_IP_PROXIES_2 = 'http://192.168.200.1:8081'

def baihe_db(personal):
    """
    数据库相关的操作

    :param personal: 为字典类型，封装着个人具体信息
    :return: 无
    """
    # 数据连接
    conn = pymssql.connect(host='localhost', user='YUANWEI', password='13974162858x', database='Baihe',charset='utf8')
    cur = conn.cursor() # 游标
    sql = """insert into users values({},'{}',{},'{}','{}','{}',{},'{}','{}','{}','{}');""" \
        .format(personal['userID'], personal['nickname'], personal['age'], '男' if personal['gender'] == "1" else '女',
                personal['cityChn'], personal['educationChn'], personal['height'],
                '没房' if personal['housing'] == 0 else '有房', '没车' if personal['car'] == 0 else '有车',
                personal['incomeChn'],personal['marriageChn'])
    print('sql: ', sql)
    try:
        cur.execute(sql) # 执行sql语句
        save_photo(personal, get_miss_photo_binary(personal['headPhotoUrl'])) # 保存头像
        print('成功获取该用户',personal['userID'])
    except pymssql.IntegrityError:
        print('该用户已存在 ',personal['userID'])
    except SystemError as sy: # 向err.txt导入错误日志
        with open('err.txt','a',encoding='utf8') as file:
            file.write(personal['nickname'] + ' ' + str(personal['userID']) + ' 错误信息：' + str(sy) + '\n') # 写
    except pymssql.ProgrammingError as pp:
        with open('err.txt','a',encoding='utf8') as file:
            file.write(personal['nickname'] + ' ' + str(personal['userID']) + ' 错误信息：' + str(pp) + '\n')
    conn.commit() # 提交
    time.sleep(1)
    cur.close()
    conn.close()

def personal_data(lists):
    """
    获取一组的详细信息，最多为8个

    :param lists: 列表类型，封装着一组信息
    :return: 无
    """
    for personal_data_dict in lists: # 遍历一组信息
        baihe_db(personal_data_dict)

def get_miss_photo_binary(photo_url):
    """
    获取照片的二进制数据

    :param photo_url: 个人头像的url
    :return: 二进制数据
    """
    binary = ''
    try:
        # 向服务器发送get请求,下载图片的二进制数据
        binary = requests.get(photo_url, headers=HEADERS,proxies={"http": HTTP_IP_PROXIES_2}).content
    except requests.exceptions.MissingSchema as rem:
        print(rem)
    except requests.exceptions.ProxyError: # 代理网络连接慢或无网络
        time.sleep(5)
        # 递归调用get_miss_photo_binary()
        get_miss_photo_binary(photo_url)
    return binary

def save_photo(personal,binary):
    """
    以'E:/Baihe/1/'为文件目录路径 或 以'E:/Baihe/0/'为文件目录路径
    以 name + id + .jpg 或 以 id + .jpg 为文件名
    有可能无相片

    :param personal: 字典类型，封装着个人具体信息
    :param binary: 二进制数据
    :return: 无
    """
    if binary != '':
        file_path = 'E:/Baihe/1/' if personal['gender'] == "1" else 'E:/Baihe/0/' #
        if not os.path.exists(file_path): # 如果该路径不存在
            os.makedirs(file_path) # 创建该路径
        try:
            # 向file_path路径保存图片
            with open(file_path + personal['nickname'] + str(personal['userID']) + '.jpg','wb') as file:
                file.write(binary)
        except OSError:
            with open(file_path + str(personal['userID']) + '.jpg','wb') as file:
                file.write(binary)


def no_exact_division(miss_id_list):
    """
   当包含用户id的列表长度不能被8整除且列表长度小于8时调用该方法

    :param miss_id_list: 为列表类型，封装着用户id
    :return: 无
    """
    miss_info_lists = ba.get_miss_info(miss_id_list)  # 获取列表的个人信息
    personal_data(miss_info_lists) # 遍历一组的信息


class Baihe(object):

    def __init__(self,account,password):
        """
        初始化
        :param account: 账号
        :param password: 密码
        """
        self.is_begin = True # 开始爬取数据
        self.index = 0 # 控制self.info长度为8个
        self.info = [] # 临时保存用户id
        self.page = 61 # 页码
        self.account = account # 账号
        self.password = password # 密码
        self.req = requests.session() # 会话，保证Cookie一致

    def login(self):
       """
       登录

       :return: 无
       """
       # 登录的url
       url_login = 'http://my.baihe.com/Getinterlogin/gotoLogin?event=3&spmp=4.20.87.225.1049&' \
                   'txtLoginEMail={}&txtLoginPwd={}'.format(self.account,self.password)
       login_dict = {}
       try:
           # 向服务器发送get请求
           login_dict = self.req.get(url_login,headers=HEADERS,proxies={"http": HTTP_IP_PROXIES_1},timeout=500).json()
       except requests.exceptions.ProxyError:  # 代理网络连接慢或无网络
            time.sleep(5)
            # 递归调用self.login()
            self.login()
       time.sleep(3)
       print('login: ',login_dict)
       self.req.keep_alive = False # 关闭会话多余的连接
       if login_dict['data'] == 1:
           print('登录成功')
       else:
           print('登录失败, 30分钟以后自动登录。。。。。。。。')
           time.sleep(1800)
           # 递归调用self.login()
           self.login()
       print('login is cookie ', requests.utils.dict_from_cookiejar(self.req.cookies)) # 查看登录后的会话cookie

    def filtrate_miss(self,pages):
        """
        根据条件筛选数据，不提供条件参数

        :param pages: 页码。该网站只提供62页的数据
        :return: 包含160个用户的id的列表
        """
        time.sleep(2)
        # 获取用户id的url
        url_miss = 'http://search.baihe.com/Search/getUserID'
        # from表单数据
        params_miss = {"minAge": 18, "maxAge": 85, "minHeight": 144, "maxHeight": 210, "education": '1-8',
                       "income": '1-12', "city": -1, "hasPhoto": 1, "page": pages, "sorterField": 1}
        miss_dict = {}
        try:
            # 发送post请求
            miss_dict = self.req.post(url_miss,data=params_miss,headers=HEADERS,proxies={'http':HTTP_IP_PROXIES_2}).json()
        except requests.exceptions.ProxyError:  # 代理网络连接慢或无网络
            time.sleep(5)
            # 递归调用self.filtrate_miss()
            self.filtrate_miss(pages)
        time.sleep(2)
        print('miss is cookies ', requests.utils.dict_from_cookiejar(self.req.cookies)) # 查看筛选后的会话cookie
        print('miss dict: ',miss_dict)
        print(len(miss_dict['data']),'个')
        return miss_dict['data']

    def get_miss_info(self,infos):
        """
        获取用户详细信息

        :param infos: 列表类型，封装着个人id，可能为一组（8），或小于8个
        :return: 包含一组的详细信息
        """
        if len(infos) == FING_INDEX: # infos列表长度等于8时
            url_info = 'http://search.baihe.com/search/getUserList?userIDs={},{},{},{},{},{},{},{}'\
                .format(infos[0],infos[1],infos[2],infos[3],infos[4],infos[5],infos[6],infos[7])
        else: # infos列表长度小于8时
            bracket = '' # 参数userIDs的值
            for lens in range(len(infos)):
                bracket += (str(infos[lens]) + ',') # 构造该表示："{},{},{},{},{},{},{},{},"
            # 获取用户详细信息的url      bracket[:len(bracket)-1]： 分片，干掉最后一个“,”
            url_info = 'http://search.baihe.com/search/getUserList?userIDs=' + bracket[:len(bracket)-1]
        miss_info = {}
        try:
            # 发送post请求
            miss_info = self.req.post(url_info,headers=HEADERS,proxies={'http':HTTP_IP_PROXIES_2}).json()
        except requests.exceptions.ProxyError:  # 代理网络连接慢或无网络
            time.sleep(5)
            # 递归调用self.get_miss_info()
            self.get_miss_info(infos)
        time.sleep(2)
        try:
            return miss_info['data']
        except KeyError:
            time.sleep(2)
            self.get_miss_info(infos)

    def exact_division(self,miss_id_list):
        """
        当包含用户id的列表长度能被8整除或包含用户id的列表长度不能被8整除且包含用户id的列表长度大于8

        :param miss_id_list: id信息列表（160）
        :return: 无
        """
        for user_id in miss_id_list:
            self.index += 1
            self.info.append(user_id)
            if ba.index == FING_INDEX:
                print('user id: ', self.info)
                miss_info_list = ba.get_miss_info(self.info) # 8
                if None != miss_info_list:
                    # 使self.index，self.info为初值，以便8人一组
                    self.index = 0
                    self.info = []
                    print('miss info list: ', miss_info_list)
                    personal_data(miss_info_list) # 遍历一组（8）的信息
                else:
                    print('miss info list is null')
                    continue

    def main(self):
        """
        具体实施

        :return: 无
        """
        self.login() # 登录
        while self.is_begin: # 开始
            print('正在获取',self.page,'页.......')
            miss_id_list = self.filtrate_miss(self.page) # 获取用户id列表
            if len(miss_id_list) != 0: # 列表有id
                num = len(miss_id_list) % FING_INDEX # 模运算
                if num == 0: # 被8整除
                    self.exact_division(miss_id_list)
                else: # 没有被8整除 , 虽然该分支没有执行，但还是要加上。因为该网站总是提供160个id
                    print('余数: ',num)
                    if len(miss_id_list) > FING_INDEX: # id列表的长度大于8
                        copy_miss_id_list = miss_id_list[:len(miss_id_list) - num] # 分片 取8个一组
                        self.exact_division(copy_miss_id_list)
                        no_exact_division(miss_id_list[len(miss_id_list) - num:]) # 余下的个人信息
                    else:
                        no_exact_division(miss_id_list) # 小于8个人的个人的信息
            else:
                print('数据已爬完。。。。。')
                self.is_begin = False
            self.page += 1
            time.sleep(10)
# 运行
if __name__ == '__main__':
    ba = Baihe('xif_yuw@163.com', '13974162858x') # 17674612951
    ba.main()