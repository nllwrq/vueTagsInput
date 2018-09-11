all-media-work
==============

## 常用命令
```
$ npm start    			# 启服务
$ npm run build 		# 构建
$ npm run serve-dist	# 构建后测试
```
## 常见问题

1. [数组的更新检测](https://cn.vuejs.org/v2/guide/list.html#数组更新检测)
2. [vuex教程](https://vuex.vuejs.org/zh-cn/)
3. 为了方便调试不要使组件的入口为index.vue

## alias
```
@ : src
libs : src/main/libs
```

## 组件测试入口
```
开发的组件放在main/libs下面

demo 目录下新建 [组件名]目录/[组件名].js [组件名].html

例如: filter  demo/filter/filter.js demo/filter/filter.html

访问方式 http://localhost:8080/demo/[组件名].html

例如: http://localhost:8080/demo/filter.html
```

## 设计
- [产品原型](http://172.21.84.43/liuting/all-media-pd)
- [设计图](http://172.21.84.43/gengbingyan/xhs-cms-pic)

## 主题色
- 写样式时请引入[src/common/style/theme.scss](http://172.21.84.43/chenzhi/all-media-work/blob/master/src/common/style/theme.scss)
- 内含老耿设计图中常用的几种颜色，免除取色烦恼

## 第三方组件

#### element
- <http://element.eleme.io/#/zh-CN/component/installation>

#### element for xh
```
1. 下拉框组件  el-select 提供三种大小： 默认、class="large"、class="middle"

```

## 异步组件

[Vue异步组件](https://cn.vuejs.org/v2/guide/components.html#异步组件)是利用[webpack的代码分割功能](https://webpack.js.org/guides/code-splitting/)实现组件的异步按需加载

#### 写法示例
- 点击box异步加载AsyncComponent组件

```
<template>
<div class="box" @click="clickBox">
	<Something></Something>
	<AsyncComponent></AsyncComponent>
</div>
</template>
<script>
import pubsub from '@/common/util/pubsub'; // 事件处理总线
import Something from './libs/something';

export default {
	components: {
		// 普通组件
		Something,

		// 异步组件
		AsyncComponent (resolve) {
			// 监听load-async-component事件
			pubsub.$on('load-async-component', () => {
				require.ensure([], () => {
					resolve(require('./libs/async-component'));
				}, 'async-component');
				pubsub.$off('load-async-component');
			});
		},
	},
	methods : {
		clickBox () {
			// 触发load-async-component事件
			pubsub.$emit('load-async-component');
		},
	},
};

</script>

```


#### 抽图图片尺寸
```
小图 270*203
中图 874*656
大图 1920*1485

```


