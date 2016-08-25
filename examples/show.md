# 上传后显示

---

## 一般使用

````html
<div style="width:50px;height:50px;background:red;margin:10px;" class="target" id="target1"></div>
````

````javascript
var Uploader = require('seedit-uploader');
	
seeditUploader = new Uploader({
	target:'#target1',
	type:'image',
	isShow:true,
	upSuccse:function(data){
		console.log(data)
	},
	beforeAjax:function(percent){
		console.log(percent)
	}
});

````