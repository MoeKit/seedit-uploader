# Demo

---

## 一般使用

````html
<div style="width:50px;height:50px;background:red;" id="target"></div>


````

````javascript
seajs.use('index', function(seeditUploader) {
	seeditUploader('#target',function(data){
		console.log(data);
		
	});
});
````
