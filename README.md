# seedit-uploader [![spm version](http://spmjs.io/badge/seedit-uploader)](http://spmjs.io/package/seedit-uploader)

---

图片上传组件，用以替代flash上传

---

## 使用方法
>存在isShow属性，且其值为true，上传后可预览  
>存在isDel属性，且其值为true，上传预览后可删除
>classtype 'string',上传图片是否带水印,可选值['user','sys']，默认'user'带水印

>添加图片尺寸选项：可使用等比压缩和强制填充,详情看初始化参数 [width] [height] [adaptive] [force]

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

+ limit:    限制上传文件大小（IE无效)，单位为M，默认值为3, 最大值不超过接口限制(10)
+ type:     限制上传文件类型，默认值为image
+ target:   选择器，添加组件的容器（必填）
+ isShow:   上传后是否预览，值为true或false，默认为false
+ isDel:    上传预览后是否可删除，值为true或false，默认为false
+ delBtnW:  删除按钮的直径大小，默认值30%
+ width:    默认不传，如指定宽度尺寸，则按宽等比缩放
+ height:   默认不传，如指定高度尺寸，则按高等比缩放
+ within: 默认不传，如指定宽高尺寸且within参数值为1，则按最小边等比缩放
+ force:    默认不传, 如指定宽度尺寸且force参数值为1，则强制填充（拉伸或压缩）指定的图片尺寸 <br><span style="font-size: 12px;color:red">*如within与force同时存在，within参数则无效</span>

##事件机制

+ errorMessage: 验证失败时提示语句执行事件（触发Ajax前）
+ delSuccse: 图片删除成功后执行的事件
+ upSuccse: 图片上传成功后返回数据时执行的事件
+ upError: 图片上传失败后返回错误信息时执行的事件
+ beforeAjax: 调用接口前的事件
+ progress：返回图片上传进度，若外部无传入事件则不执行.(IE及安卓4.2.1只返回纯文字)

##接口相关

http://image.office.bzdev.net/upload.php