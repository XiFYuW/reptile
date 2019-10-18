#__author: "YuWei"
#__date: 2018/2/11
import numpy as np
import matplotlib.pyplot as plt
import pymssql

def db(sql):
    """
    数据库相关操作

    :param sql: sql语句
    :return: 查询的结果集，list封装
    """
    conn = pymssql.connect(host='localhost', user='YUANWEI', password='13974162858x', database='Baihe', charset="utf8")
    cur = conn.cursor()
    cur.execute(sql)
    row = cur.fetchone() # 指向结果集的第一行，
    data = [] # 返回的list
    while row:
        rows = list(row)
        for i in range(len(rows)): # 针对rows的每项编码
            try:
                rows[i] = rows[i].encode('latin-1').decode('gbk')
            except AttributeError:pass
        data.append(rows) # 向data加数据
        row = cur.fetchone() #
    print(data)
    cur.close()
    conn.close()
    return data

def builder_income_ratio():
    """
    生成各工资段人数占总人数比图

    :return: 无
    """
    data_list = db("select income,count(id) from users group by income")
    income_data_list = [] # 数据
    income_labels_list = [] # 图例
    for data in data_list:
        income_data_list.append(data[1])
        income_labels_list.append(data[0])
    income_data_list.remove(income_data_list[6]) # 删掉不要的数据
    income_labels_list.remove(income_labels_list[6]) # 删掉不要的数据
    # 画饼图
    plt.pie(income_data_list,labels=income_labels_list,colors=['c','m','r','g'],startangle=30,
            shadow=True,explode=(0, 0, 0.1, 0, 0, 0, 0.1, 0, 0.1, 0, 0, 0),autopct='%.1f%%')
    plt.title('各工资段人数占总人数比') # 标题
    plt.show() # 显示

def builder_sex_ratio():
    """
    生成各工资段男，女人数图

    :return: 无
    """
    data_list = db("select income,dbo.getSexNumber('男',income) as 男 ,dbo.getSexNumber('女',income) as 女 "
                    "from users group by income")
    men = [] # 男
    women = [] # 女
    labels =[] # 图例
    for data in data_list:
        labels.append(data[0])
        men.append(data[1])
        women.append(data[2])
    men.remove(men[6]) # 删掉不要的数据
    women.remove(women[6]) # 删掉不要的数据
    labels.remove(labels[6]) # 删掉不要的数据
    max_line = 12 # 12个
    fig,ax = plt.subplots()
    line = np.arange(max_line) # [0,1,2,3,4,5,6,7,8,9,10,11]
    bar_width = 0.4 # 条形之间的宽度
    # 画条形图
    ax.bar(line, men, bar_width,alpha=0.3, color='b',label='男')
    ax.bar(line+bar_width, women, bar_width,alpha=0.3, color='r',label='女')
    ax.set_xlabel('工资段')
    ax.set_ylabel('人数')
    ax.set_title('各工资段男，女人数图')
    ax.set_xticks(line + bar_width / 2) # 保证条形居中
    ax.set_xticklabels(labels)
    # 画两条线
    plt.plot([0.04, 1.04, 2.04, 3.04, 4.04, 5.04, 6.04, 7.04, 8.04, 9.04, 10.04, 11.04], men, label='男')
    plt.plot([0.4, 1.4, 2.4, 3.4, 4.4, 5.4, 6.4, 7.4, 8.4, 9.4, 10.4, 11.4], women, label='女')
    ax.legend()
    fig.tight_layout()
    # fig.savefig("1.png") # 生成图片
    plt.show()

def builder_age_ratio():
    """
    生成男，女平均身高图

    :return:
    """
    data_list = db("select sex,avg(height) as 平均升高 from users group by sex")
    sex = [] # 性别
    number = [] # 人数
    for data in data_list:
        sex.append(data[0])
        number.append(data[1])
    # 画条形图
    plt.bar(sex[0], number[0], label="男", color='g',width=0.03)
    plt.bar(sex[1], number[1], label="女", color='r',width=0.03)
    plt.legend()
    plt.xlabel('性别')
    plt.ylabel('身高')
    plt.title('男女平均身高图')
    plt.show()

def builder_housing_sum_ratio():
    """
    生成有房与无房的人数比例图

    :return:
    """
    data_list = db("select housing,count(id) from users group by housing")
    housing_data_list = []
    housing_labels_list = []
    for data in data_list:
        housing_data_list.append(data[1])
        housing_labels_list.append(data[0])
    # 画饼图
    plt.pie(housing_data_list, labels=housing_labels_list, colors=['g', 'r'], startangle=30,
            shadow=True, explode=(0, 0), autopct='%.0f%%')
    plt.title('有房与无房的人数比例图')
    plt.show()

def builder_housing_ratio():
    """
    生成有无房男女人数图

    :return:
    """
    data_list = db("select dbo.gethousing('女',housing),dbo.gethousing('男',housing) from users group by housing")
    homey = [] # 有房
    homem = [] # 无房
    for data in data_list:
        homey.append(data[0])
        homem.append(data[1])
    max_line = 2 # 两个
    fig, ax = plt.subplots()
    line = np.arange(max_line) # [0,1]
    bar_width = 0.1 # 条形之间的宽度
    # 画条形
    ax.bar(line,homey , bar_width, alpha=0.3,color='b',label='女')
    ax.bar(line+bar_width, homem, bar_width,alpha=0.3,color='r',label='男')
    ax.set_xlabel('有无房')
    ax.set_ylabel('人数')
    ax.set_title('有无房男女人数图')
    ax.set_xticks(line + bar_width / 2) # 保持居中
    ax.set_xticklabels(['有房','无房'])
    ax.legend()
    fig.tight_layout()
    plt.show()

# builder_sex_ratio()
# builder_income_ratio()
# builder_age_ratio()
# builder_housing_sum_ratio()
builder_housing_ratio()