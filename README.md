# seedit-uploader [![spm version](http://spmjs.io/badge/seedit-uploader)](http://spmjs.io/package/seedit-uploader)

---

图片上传组件，用以替代flash上传

---

## 使用方法
>存在isShow属性，且其值为true，上传后可预览  
>存在isDel属性，且其值为true，上传预览后可删除

```javascript
var Uploader = require('seedit-uploader');
	
seeditUploader = new Uploader({
	target:'#target1',
	type:'image'
	},
	upSuccse(data){
	}
);
```

##初始化参数

+ limit:   限制上传文件大小（IE无效)，单位为M，默认值为3, 最大值不超过接口限制(10)
+ type:    限制上传文件类型，默认值为image
+ target:  选择器，添加组件的容器（必填）
+ isShow:  上传后是否预览，值为true或false，默认为false
+ isDel:   上传预览后是否可删除，值为true或false，默认为false
+ delBtnW: 删除按钮的直径大小，默认值30%

##事件机制

+ errorMessage: 验证失败时提示语句执行事件（触发Ajax前）
+ delSuccse: 图片删除成功后执行的事件
+ upSuccse: 图片上传成功后返回数据时执行的事件
+ upError: 图片上传失败后返回错误信息时执行的事件
+ beforeAjax: 图片上传前提醒用户等待的事件


##接口相关

http://image.office.bzdev.net/upload.php