import requests
import re
import time
import os
OK_ERR = 320
class BaiDuMusic(object):

    def __init__(self):
        # 请求头，伪装成浏览器
        self.headers = {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:58.0) Gecko/20100101 Firefox/58.0'}
        self.start_number = 0 # 每一位歌手的歌曲起始数量,取值为0,25,50,75,100等,分别代表1,2,3,4,5页
        self.max_page = 10000 # 最大歌曲页数
        self.data_song_list_id = [] # 存放歌曲的id
        self.song_index = 0 # 控制一组歌曲(10首)
        self.song_id_list_temp = [] # 临时存取歌曲id
        self.path = 'E:/BaiDuMusic/' # 文件根目录
        self.numbers = 0 # 歌曲数
        self.song_name = ""
        self.proxies="http://182.61.35.21:80"

    def get_sum_singer(self):
        req = requests.get("http://music.baidu.com/artist", headers=self.headers,proxies={"http": self.proxies})  # 歌手的url
        req.encoding = 'utf8' # 设置编码
        html = req.text.strip()
        # 正侧匹配
        singer_list = re.findall(r"""<a href="(.*?)" title="(.*?)" class="cover-item-artist-name">""", html)\
                      + re.findall(r"""<a href="(.*?)" title="(.*?)">(.*?)</a>""", html)[10:][:-4]\
                      + re.findall("""<a href="(.*?)" class='list-item-artist-name-hot' title="(.*?)">""", html)\
                      + re.findall("""<a href="(.*?)" title="(.*?)" >""", html)
        print('共',len(singer_list), "个歌手")
        return singer_list

    # 批量下载的，一个一个下载，因此会先设置一个人的所有歌曲的id
    def set_data_song_list_id(self,index_singer):
        ting_uid = index_singer[0][index_singer[0].find("/artist/") + len("/artist/"):]
        print('正在获取歌手id:',ting_uid,'姓名为:',index_singer[1])
        for number in range(self.max_page): # 以最大歌曲页数
            # 每个歌手的歌曲的url
            url_singer = "http://music.baidu.com/data/user/getsongs?start={}&ting_uid={}" \
                .format(self.start_number, ting_uid)
            data_song_dict = requests.get(url_singer, headers=self.headers,proxies={"http": self.proxies}).json()
            if len(data_song_dict['data']['html']) > OK_ERR:
                song_html = data_song_dict['data']['html']
                # 匹配歌曲id
                song_id_list = re.findall(r"""<span class="music-icon-hook" data-musicicon='(.*?)'>""", song_html)
                for song in song_id_list:
                    self.data_song_list_id.append(song[song.find("{&quot;id&quot;:&quot;") + len("{&quot;id&quot;:&quot;")
                                                       :song.find("&quot;,&quot;type&quot;:")])
                self.start_number += 25 # start_number增量25
            else:
                break

    @staticmethod
    def set_file_path(file_path):
        if not os.path.exists(file_path):
            os.makedirs(file_path)

    def check(self,song_name):
        self.song_name = song_name
        if self.song_name.find("?") != -1:
            self.song_name = self.song_name.replace("?", " ")
        if self.song_name.find('''"''') != -1:
            self.song_name = self.song_name.replace('''"''', " ")
        if self.song_name.find('''.''') != -1:
            self.song_name = self.song_name.replace('''.''', " ")
        if self.song_name.find('''@''') != -1:
            self.song_name = self.song_name.replace('''@''', " ")
        if self.song_name.find('''#''') != -1:
            self.song_name = self.song_name.replace('''#''', " ")
        if self.song_name.find('''$''') != -1:
            self.song_name = self.song_name.replace('''$''', " ")
        if self.song_name.find('''%''') != -1:
            self.song_name = self.song_name.replace('''%''', " ")
        if self.song_name.find('''*''') != -1:
            self.song_name = self.song_name.replace('''*''', " ")
        if self.song_name.find('''^''') != -1:
            self.song_name = self.song_name.replace('''^''', " ")


    def sav_song(self,song_list,music_path_temp,lrc_path_temp,info_path_temp):
        for song_list_index in song_list:
            music_path = "?"
            try:  # OSError requests.exceptions.ProxyError TypeError requests.exceptions.MissingSchema
                print('song_list_index:',song_list_index)
                self.check(song_list_index['songName'])

                if song_list_index['version'] == '伴奏':
                    music_path = music_path_temp + song_list_index['artistName'] + "--" + self.song_name.strip() \
                                 + "(伴奏)" + "." + song_list_index['format']
                else:
                    music_path = music_path_temp + song_list_index['artistName'] + "--" + self.song_name.strip() \
                                 + "." + song_list_index['format']

                music_content = requests.get(song_list_index['songLink'], headers=self.headers,proxies={"http": self.proxies}).content

                print(music_path)
                with open(music_path, 'wb') as music:
                    music.write(music_content)

                lrc_path = lrc_path_temp+ song_list_index['artistName'] + "--" + self.song_name.strip()+ ".lrc"
                print(lrc_path)
                with open(lrc_path,'w',encoding='utf8') as lrc:
                    lrc.write(requests.get(song_list_index['lrcLink'], headers=self.headers,proxies={"http": self.proxies}).text)

                info_path = info_path_temp + "info.txt"
                print(info_path)
                with open(info_path,'a',encoding='utf8') as info:
                    info.write("歌曲id="+str(song_list_index['songId'])+"  "+"歌名="+self.song_name.strip()
                                +"  "+"演唱="+song_list_index['artistName']+"  "+"时长="+str(song_list_index['time'])+"秒"
                                +"  "+"大小="+str(song_list_index['size'])+"字节" + "\n")

            except OSError as ose:
                with open("E:\BaiDuMusic\err.txt", 'a', encoding='utf8') as err:
                    err.write("OSError:  歌曲路径=" + music_path + "  错误提示=" + str(ose) + "\n")
            except requests.exceptions.MissingSchema as rem:
                with open("E:\BaiDuMusic\err.txt", 'a', encoding='utf8') as err:
                    err.write("requests.exceptions.MissingSchema:  music_path=" + music_path
                              + "  歌曲信息=" + str(song_list_index) + "  错误提示=" + str(rem) + "\n")
            except TypeError as te:
                with open("E:\BaiDuMusic\err.txt", 'a', encoding='utf8') as err:
                    err.write("TypeError:  music_path=" + music_path + "  歌曲信息=" + str(song_list_index) + "  错误提示=" + str(te) + "\n")
            except requests.exceptions.ProxyError:
                time.sleep(1)
                self.sav_song(song_list, music_path_temp, lrc_path_temp, info_path_temp)
            except AttributeError as ae:
                with open("E:\BaiDuMusic\err.txt", 'a', encoding='utf8') as err:
                    err.write("AttributeError:  歌曲信息=" + str(song_list_index) + "  错误提示=" + str(ae) + "\n")

            self.numbers += 1
            print('已获取',self.numbers,'首歌')
            time.sleep(1)


    def get_song_info(self,song_id_integer,music_path,lrc_path,info_path):
        for song_id in song_id_integer:
            self.song_id_list_temp.append(song_id)
            self.song_index += 1
            if self.song_index == 10:
                url_song_get = "http://play.baidu.com/data/music/songlink?songIds={},{},{},{},{},{},{},{},{},{}"\
                    .format(self.song_id_list_temp[0],self.song_id_list_temp[1],self.song_id_list_temp[2],
                            self.song_id_list_temp[3],self.song_id_list_temp[4],self.song_id_list_temp[5],
                            self.song_id_list_temp[6],self.song_id_list_temp[7],self.song_id_list_temp[8],
                            self.song_id_list_temp[9])
                song_dict_info = requests.post(url_song_get,headers=self.headers,proxies={"http": self.proxies}).json()
                self.sav_song(song_dict_info['data']['songList'],music_path,lrc_path,info_path)
                self.song_id_list_temp = []
                self.song_index = 0

    def main(self):
        index = 1
        for index_singer in self.get_sum_singer(): # 获取歌手
            if index > 200: #
                print('index_singer:', index_singer, '正在获取第', index-200, '位')
                music_path = self.path + index_singer[1] + "/music/"
                self.set_file_path(music_path)
                lrc_path = self.path + index_singer[1] + "/lrc/"
                self.set_file_path(lrc_path)
                info_path = self.path + index_singer[1] + "/info/"
                self.set_file_path(info_path)
                self.set_data_song_list_id(index_singer)
                remainder = len(self.data_song_list_id) % 10  # 取余数
                if remainder != 0:
                    data_song_list_id_integer = self.data_song_list_id[0:len(self.data_song_list_id) - remainder]  # 取整数
                    self.get_song_info(data_song_list_id_integer,music_path,lrc_path,info_path)
                    # 取余下来的数
                    remain_num = self.data_song_list_id[len(data_song_list_id_integer):]
                    for data_song_list_num in remain_num:
                        url_song_gets = "http://play.baidu.com/data/music/songlink?songIds={}".format(data_song_list_num)
                        song_dict_info = requests.post(url_song_gets, headers=self.headers,proxies={"http": self.proxies}).json()
                        self.sav_song(song_dict_info['data']['songList'],music_path,lrc_path,info_path)
                else:
                    self.get_song_info(self.data_song_list_id,music_path,lrc_path,info_path)
                self.start_number = 0
                self.data_song_list_id = []
            index += 1


if __name__ == '__main__':
    bdm = BaiDuMusic()
    bdm.main()
