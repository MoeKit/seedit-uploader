# 上传显示加删除

---

## 一般使用

````html
<div style="width:50px;height:50px;background:red;margin:10px;" class="target" id="target1"></div>
<div style="width:50px;height:50px;background:red;margin:10px;" class="target" id="target2"></div>
<button type="button" style="margin:10px;">reset</button>
````

````javascript
var Uploader = require('seedit-uploader');
var $ = require('jquery');
var a = '<div style="width:50px;height:50px;background:red;margin:10px;" class="target" id="target1"></div><div style="width:50px;height:50px;background:red;margin:10px;" class="target" id="target2"></div><button type="button" class="reset" style="margin:10px;">reset</button>';

init();
btn();

function init(){
	var arr = document.getElementsByClassName("target");
	for(var i=0;i<arr.length;i++){
		var _id = arr[i].id;
		seeditUploader = new Uploader({
			target:'#'+_id,
			type:'image',
			isShow:true,
			isDel:true,
			upSuccse:function(data){
				console.log(data)
			}
		})
	}
}

function btn(){
	document.querySelector('button').addEventListener('click',function(){
		document.querySelector('.nico-insert-code').innerHTML = a;
		init();
		btn()
	})
}
````