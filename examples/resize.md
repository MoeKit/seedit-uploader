# 上传图片尺寸设置
---

## 使用方法

````html
<style>
	/*不强制图片100%满屏显示*/
	.mk-img{
		width: auto;
		height: auto;
	}
</style>
<h3>按宽度等比缩放</h3>
<div style="width:200px;height:200px;background:red;margin:10px;" class="target" id="target1"></div>
<h3>按高度等比缩放</h3>
<div style="width:200px;height:200px;background:red;margin:10px;" class="target" id="target2"></div>
<h3>自适应等比缩放（须指定宽高）</h3>
<div style="width:200px;height:200px;background:red;margin:10px;" class="target" id="target3"></div>
<h3>填充（须指定宽高）</h3>
<div style="width:200px;height:200px;background:red;margin:10px;" class="target" id="target4"></div>
````

````javascript
var Uploader = require('seedit-uploader');
//按宽度等比缩放
seeditUploader = new Uploader({
	target:'#target1',
	isShow:true,
	classtype:'sys',
	width:200,
	limit:10,
	upSuccse:function(data){
		console.log(data)
	}
});
//按高度等比缩放
seeditUploader1 = new Uploader({
	target:'#target2',
	isShow:true,
	classtype:'sys',
	height:200,
	limit:10,
	upSuccse:function(data){
		console.log(data)
	}
});

//自适应等比缩放（须指定宽高）
seeditUploader2 = new Uploader({
	target:'#target3',
	isShow:true,
	classtype:'sys',
	width:200,
	height:200,
	within:1,
	limit:10,
	upSuccse:function(data){
		console.log(data)
	}
});
//填充（须指定宽高）
seeditUploader3 = new Uploader({
	target:'#target4',
	isShow:true,
	classtype:'sys',
	width:200,
	height:200,
	force:1,
	limit:10,
	upSuccse:function(data){
		console.log(data)
	}
});
````