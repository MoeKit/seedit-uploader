# seedit-uploader [![spm version](http://spmjs.io/badge/seedit-uploader)](http://spmjs.io/package/seedit-uploader)

---

图片上传组件，用以替代原来的flash上传

---

## API

```javascript
seajs.use('index', function(seeditUploader) {
	new seeditUploader({
        target:'#target', // 目标
        type:'image', // 类型，现在只支持image
        limit:3 // 大小，单位为M
    },function(data){
		console.log(data);
	});
});
```

## 测试

测试页面必须使用(HOST绑定)符合3个环境的子域名。

+ x.username.bzdev.net,如dev.csf.bzdev.net
+ x.username.bozhong.com,如dev.csf.bozhong.com
+ x.seedit.com,如dev.seedit.com

本地没有source服务，要绑定到`*.office.bzdev.net`,使用内网的source服务。
