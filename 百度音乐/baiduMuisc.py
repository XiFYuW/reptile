#__author: "YuWei"
#__date: 2018/3/9
import requests
import re
import time
import os
# print(requests.get("http://qukufile2.qianqian.com/data2/lrc/694a054c9417628f6012b756126c5449/568249957/568249957.lrc").text)
# 请求头，伪装成浏览器
HEADERS = {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:58.0) Gecko/20100101 Firefox/58.0'}
r = requests.get("http://music.baidu.com/artist",headers=HEADERS) # 歌手的url
r.encoding = 'utf8'
html = r.text.strip()
singer_re_1 = r"""<a href="(.*?)" title="(.*?)" class="cover-item-artist-name">"""
singer_list = re.findall(singer_re_1, html)
singer_re_2 = r"""<a href="(.*?)" title="(.*?)">(.*?)</a>"""
singer_list = singer_list + re.findall(singer_re_2, html)[10:][:-4]
singer_re_3 = """<a href="(.*?)" class='list-item-artist-name-hot' title="(.*?)">"""
singer_list = singer_list + re.findall(singer_re_3, html)
singer_re_4 = """<a href="(.*?)" title="(.*?)" >"""
singer_list = singer_list+ re.findall(singer_re_4, html)
print(len(singer_list),"个歌手")
page = 0
max_page = 20
data_song_list_id = [] # 存放歌曲的id
for i in singer_list: # 每个歌手
    for p in range(max_page):
        url_main = "http://music.baidu.com/data/user/getsongs?start={}&ting_uid={}"\
            .format(page,i[0][i[0].find("/artist/") + len("/artist/"):]) # 每个歌手的歌曲的url
        song_json = requests.get(url_main,headers=HEADERS).json()
        if len(song_json['data']['html']) > 300:
            html1 = song_json['data']['html']
            song_re_1 = r"""<span class="music-icon-hook" data-musicicon='(.*?)'>"""
            song_list = re.findall(song_re_1, html1)
            print()
            for song in song_list:
                queryId = song[song.find("{&quot;id&quot;:&quot;") + len("{&quot;id&quot;:&quot;"):song.find(
                    "&quot;,&quot;type&quot;:")]
                print(queryId)
                data_song_list_id.append(queryId)
            page += 25
        else:
            print("break")
            break
    song_list_id = []
    song_index = 0
    remainder = len(data_song_list_id) % 10 # 取余数
    if remainder == 0:
        for song_id in data_song_list_id:
            song_list_id.append(song_id)
            song_index += 1
            if song_index == 10:
                print(song_list_id)
                url_song_get = "http://play.baidu.com/data/music/songlink?songIds={},{},{},{},{},{},{},{},{},{}"\
                    .format(song_list_id[0],song_list_id[1],song_list_id[2],song_list_id[3],song_list_id[4],
                            song_list_id[5],song_list_id[6],song_list_id[7],song_list_id[8],song_list_id[9])
                song_dict_info = requests.post(url_song_get,headers=HEADERS).json()
                songList = song_dict_info['data']['songList']
                for song_list_index in songList:
                    file_path = 'E:/BaiDuMusic/' + song_list_index['artistName'] + "/"
                    music_content = requests.get(song_list_index['songLink'],headers=HEADERS).content
                    if not os.path.exists(file_path):
                        os.makedirs(file_path)
                        with open(file_path + song_list_index['artistName'] + "--" + song_list_index['songName']
                                  + "." + song_list_index['format'],'wb') as music:
                            music.write(music_content)
                            time.sleep(1)
                song_list_id = []
                song_index = 0
    else:
        data_song_list_id_integer = data_song_list_id[0:len(data_song_list_id) - remainder] # 取整数
        for song_id in data_song_list_id_integer:
            song_list_id.append(song_id)
            song_index += 1
            if song_index == 10:
                print(song_list_id)
                url_song_get = "http://play.baidu.com/data/music/songlink?songIds={},{},{},{},{},{},{},{},{},{}" \
                    .format(song_list_id[0], song_list_id[1], song_list_id[2], song_list_id[3], song_list_id[4],
                            song_list_id[5], song_list_id[6], song_list_id[7], song_list_id[8], song_list_id[9])
                song_dict_info = requests.post(url_song_get, headers=HEADERS).json()
                songList = song_dict_info['data']['songList']
                for song_list_index in songList:
                    file_path = 'E:/BaiDuMusic/' + song_list_index['artistName'] + "/"
                    music_content = requests.get(song_list_index['songLink'],headers=HEADERS).content
                    if not os.path.exists(file_path):
                        os.makedirs(file_path)
                    print(file_path + song_list_index['artistName'] + "--" + song_list_index['songName']
                                + "." + song_list_index['format'])
                    with open(file_path + song_list_index['artistName'] + "--" + song_list_index['songName']
                                + "." + song_list_index['format'],'wb') as music:
                        music.write(music_content)
                        time.sleep(1)
                song_list_id = []
                song_index = 0
        print(data_song_list_id[len(data_song_list_id_integer):])
        for data_song_list_num in data_song_list_id[len(data_song_list_id_integer):]:
            url_song_gets = "http://play.baidu.com/data/music/songlink?songIds={}".format(data_song_list_num)
            song_dict_info = requests.post(url_song_gets, headers=HEADERS).json()
            songList = song_dict_info['data']['songList']
            for song_list_index in songList:
                file_path = 'E:/BaiDuMusic/' + song_list_index['artistName'] + "/"
                music_content = requests.get(song_list_index['songLink'], headers=HEADERS).content
                if not os.path.exists(file_path):
                    os.makedirs(file_path)
                print(file_path + song_list_index['artistName'] + "--" + song_list_index['songName']
                      + "." + song_list_index['format'])
                with open(file_path + song_list_index['artistName'] + "--" + song_list_index['songName']
                            + "." + song_list_index['format'], 'wb') as music:
                    music.write(music_content)
                    time.sleep(1)
    page = 0
    max_page = 20
    data_song_list_id = []
    break
