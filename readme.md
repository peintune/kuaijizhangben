# 介绍
快记账本记账是一款离线优先的记账app, 支持快速记账、多类型记账、多账本、多账户、统计、断网记账、同步数据到云端、关闭同步数据、一键手机号登录等功能。快记账本优先使用离线模式，数据存储在本地，安全可靠并且运行速度快。

1，快记账本是由态古代科技（上海）有限公司开发。适用于生活记账、旅行记账、生意记账、学生记账、装修记账等场景。
2，快记账本开机无广告，快速进入，快速记账。还支持按周、按月、按年统计收入和支持情况，有清晰的图标分析，让您随时掌握资金流向。
3，快记账本还支持借入、借出单独账号，让你可以记录借款资金情况。
4，快记账本支持离线记账，在没有网络的情况下也可以使用。

![图片](https://img2.imgtp.com/2024/05/11/I85LV7OQ.png)
![图片](https://img2.imgtp.com/2024/05/11/D8AANLUm.png)
![图片](https://img2.imgtp.com/2024/05/11/XqvbdOZN.png)
![图片](https://img2.imgtp.com/2024/05/11/8odlQZ0h.png)


# 构建运行方式
### 1 通过hbuilder导入

### 2 创建自定义基座
```
 用到了dayjs，所以需要hbuilder打一个自定义基座

 npm install dayjs --save
 
 运行-》手机或模拟器-》 自定义基座
 
 包名：com.xxxxx.kuaijizhang
 自有证书
 证书别名：kuaix
 密码：Qsssxxxx
 证书文件：xxxx/shuimujizhang/zhengshu/kuaijizhang.keystore
```

### 3 运行
运行 -》 运行到浏览器

# 打包方式
### 1 通过hbuilder 导入
### 2 发行 -》 云原生打包
### 3 ios打包：需要苹果开发者账号，并创建相关证书


# 功能列表
### 离线功能
- 记账
- 按月查看账单
- 多账本管理
- 多账户管理
- 离线统计

### 联网功能（非必须）
- 手机号一键登录 （使用阿里云服务）
- 短信登录 （使用阿里云服务）
- 同步数据到云端
- 注册/登录



# 需要修改的地方
### 隐私协议（如需上架需修改）
在androidManifest.xml中修改
在manifest.json中修改
在oneLogin.vue中修改
在yinsixieyi.vue中修改
在yonghuzhengce.vue中修改
在mobile_sign.vue中修改


### 阿里云号码认证服务（如需手机号一键登录需修改）
在manifest.json中修改 AliCloud-NirvanaPns
服务端需要对接阿里云SDK,请参考阿里云的官方文档
在在oneLogin.vue中修改androidAliyunAuth


### 服务端主域名修改（如需将本地数据同步到云端需修改）
修改common.js文件

# 本地数据示例
### 账本
const cacheMap = uni.getStorageSync("zhangbenCache");
    {"type":"object","data":{"1":{"number":"1","name":"默认账本","createTime":1669643875000,"updateTime":1669643875000,"type":"(系统默认)","shouru":0,"zhichu":0,"count":0,"creator":"系统","participant":"我","color":"#5a79ff"}}}
const cacheZhangbenNumber= uni.getStorageSync("currentZhanbenNumber");
    1

### 账户
const zhanghuCache= uni.getStorageSync("zhanghuCache");
    {"type":"object","data":{"0":[{"number":1,"templateId":1,"icon":"t-icon-_xianjin","name":"现金","type":"现金","category":0,"count":0,"describe":"系统创建"}],"1":[{"number":2,"templateId":2,"icon":"t-icon-zhifubao1","name":"支付宝","type":"在线支付","category":1,"count":0,"describe":"系统创建"},{"number":3,"templateId":3,"icon":"t-icon-weixin1","name":"微信","type":"在线支付","category":1,"count":0,"describe":"系统创建"}],"2":[{"number":4,"templateId":4,"icon":"t-icon-jiechu","name":"借出","type":"债务","category":2,"count":0,"describe":"系统创建"},{"number":5,"templateId":5,"icon":"t-icon-zu-copy","name":"借入","type":"债务","category":2,"count":0,"describe":"系统创建"}]}}
### 账单
const cacheMap = uni.getStorageSync("dataCache");
    {"type":"object","data":{"1":{"2022-11-28":{"data":[{"number":1669644192000,"date":"2022-11-28","count":"+6588","inv":1,"beizhuText":"","category":"icon-gongzihefang","categoryName":"工资","createTime":"2022-11-28T14:03:12.733Z","createTimeOfDay":"22点3分","zhangbenNum":"1","zhanghuNum":2,"zhanghuCategory":1},{"number":1669644161000,"date":"2022-11-28","count":"-333","inv":0,"beizhuText":"","category":"icon-renminbi","categoryName":"其他","createTime":"2022-11-28T14:02:41.350Z","createTimeOfDay":"22点2分","zhangbenNum":"1","zhanghuNum":"3","zhanghuCategory":1}],"zhichu":333,"shouru":6588},"2022-11-23":{"data":[{"number":1669644168000,"date":"2022-11-23","count":"-66","inv":0,"beizhuText":"","category":"icon-renminbi","categoryName":"其他","createTime":"2022-11-28T14:02:48.432Z","createTimeOfDay":"22点2分","zhangbenNum":"1","zhanghuNum":"3","zhanghuCategory":1}],"zhichu":66,"shouru":0},"2022-10-12":{"data":[{"number":1669644177000,"date":"2022-10-12","count":"-522","inv":0,"beizhuText":"","category":"icon-renminbi","categoryName":"其他","createTime":"2022-11-28T14:02:57.616Z","createTimeOfDay":"22点2分","zhangbenNum":"1","zhanghuNum":"3","zhanghuCategory":1}],"zhichu":522,"shouru":0}}}}

### 登录状态
const loginState = uni.getStorageSync("loginState");
   {"type":"object","data":{"isLogin":false,"isVip":false,"loginTime":"2022-11-28T13:58:13.089Z"}}

uni.getStorageSync("token")
   eyxxxxxxx

### 变更数据
uni.getStorageSync("changedData")
    {"type":"object","data":[{"type":"zhangben","isDelete":false,"data":{"number":"1","name":"默认账本","createTime":1669643875000,"updateTime":1669643875000,"type":"(系统默认)","shouru":0,"zhichu":0,"count":0,"creator":"系统","participant":"我","color":"#5a79ff"}},{"type":"zhanghu","isDelete":false,"data":{"number":1,"templateId":1,"icon":"t-icon-_xianjin","name":"现金","type":"现金","category":0,"count":0,"describe":"系统创建"}},{"type":"zhanghu","isDelete":false,"data":{"number":2,"templateId":2,"icon":"t-icon-zhifubao1","name":"支付宝","type":"在线支付","category":1,"count":0,"describe":"系统创建"}},{"type":"zhanghu","isDelete":false,"data":{"number":3,"templateId":3,"icon":"t-icon-weixin1","name":"微信","type":"在线支付","category":1,"count":0,"describe":"系统创建"}},{"type":"zhanghu","isDelete":false,"data":{"number":4,"templateId":4,"icon":"t-icon-jiechu","name":"借出","type":"债务","category":2,"count":0,"describe":"系统创建"}},{"type":"zhanghu","isDelete":false,"data":{"number":5,"templateId":5,"icon":"t-icon-zu-copy","name":"借入","type":"债务","category":2,"count":0,"describe":"系统创建"}}]}