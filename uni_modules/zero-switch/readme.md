# zero-switch

## 插件说明

个人仅用于微信小程序，简单封装一个好看的switch开关组件

## 使用方法

```html
<template>
	<view class="container">
	<!-- 正常使用 -->
	<zero-switch  v-model="switchBtn"></zero-switch>
	
	<!-- 自定义样式 -->
	<zero-switch class='inline_item' v-model="switchBtn" :showText="true" backgroundColorOff="#ABDCFF" backgroundColorOn="#ABDCFF" activeColor='#0396FF' inactiveColor='#ffffff'>
	</zero-switch>
	
	<!-- 异步控制 -->
	<zero-switch  v-model="btnAsync" @change="handleAsync"></zero-switch>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				switchBtn: false,
				btnAsync:false
			}
		},
		methods:{
			handleAsync(e) {
				uni.showModal({
					title: '提示',
					content: '确定要改变开关状态吗?',
					success: (res) => {
						if (res.confirm) {
							console.log('用户点击确定');
							this.btnAsync = !this.btnAsync
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			}
			
		},
	}
</script>
```

## 参数说明

|参数				|类型	|默认值	|描述							|
|--					|--		|--		|--								|
|value				|Boolean|false	|开关状态						|
|activeColor		|String	|#1EABFA|开关开启时颜色					|
|inactiveColor		|String	|#cccccc|开关关闭时颜色					|
|backgroundColorOn	|String	|#ffffff|开关开启背景颜色				|
|backgroundColorOff	|String	|#ffffff|开关关闭背景颜色				|
|borderColorOn		|String	|#eeeeee|开关开启边框颜色				|
|borderColorOff		|String	|#eeeeee|开关关闭边框颜色				|
|showText			|Boolean|false	|是否显示文字(只能显示一个字)	|
|textOn				|String	|开		|开关开启时的文字				|
|textOff			|String	|关		|开关关闭时的文字				|
|size				|Number	|26		|开关大小						|
|disabled			|Boolean|false	|是否禁用						|
|stopChange			|Boolean|false	|是否需要异步控制				|

## event

|参数	|返回值	|
|---	|---	|
|change	| value	|

插件预览:
![code](https://img.jszero.cn/mweb/we_code.jpg)

> 预览的小程序不一定能及时更新当前插件