'use strict';
// var $ = require('jquery');
require('./src/css/style.css');
require('iframe-ajax')($,{});
var Config = require('seedit-config');
var formDiv = require('./src/tpl/form.tpl');
var imgDiv = '<img class="mk-img hide">';
var delDiv = '<a href="javascript:void(0)" class="mk-del hide"></a>';
var ua = navigator.userAgent;
var androidUA = ua.match(/Android 4\.4(\.1)?(\.2)?/);

var uploader = function(opt){
    var _this = this;
    _this.init(opt);
    if(!!(/LieBaoFast/).test(ua) && !!androidUA){
        return _this.errorMessage('该浏览器版本无法支持上传功能，请更换浏览器以获得更好体验^_^')
    }
    return this;
}

function isIE(ver){
    var b = document.createElement('b')
    b.innerHTML = '<!--[if IE ' + ver + ']><i></i><![endif]-->'
    return b.getElementsByTagName('i').length === 1
}

uploader.prototype.init = function(opt){
    this.limit = opt.limit || 3;
    this.target = $(opt.target);
    this.form = '';
    this.isShow = opt.isShow || false;
    this.isDel = opt.isDel || false;
    this.isCompress = opt.isCompress || false;
    this.compressLimit = opt.compressLimit || 300;
    this.compressRatio = opt.compressRatio || 0.8;
    this.classtype= opt.classtype || 'user';
    this.delBtnW = opt.delBtnW || '30%';
    this.api = opt.api || '';
    this.width  = opt.width  ? '<input type="hidden" name="resizer_width" value="'+opt.width+'">' : '';
    this.height = opt.height ? '<input type="hidden" name="resizer_height" value="'+opt.height+'">' : '';
    this.within = opt.within ? '<input type="hidden" name="resizer_within" value="'+opt.within+'">' : '';
    this.force = opt.force ? '<input type="hidden" name="resizer_force" value="'+opt.force+'">' : '';
    this.delSuccse = opt.delSuccse || function(){
    }
    this.upSuccse = opt.upSuccse || function(url){
        if(!isIE()){
            console.log(url)
        }
    }
    this.upError = opt.upError || function(data){
        if(!isIE()){
            console.log(data)
        }
    }
    this.beforeAjax = opt.beforeAjax || function(){
    }
    this.beforeCompress = opt.beforeCompress || function(){
    }
    this.progress = opt.progress;
    this.compressProgress = opt.compressProgress;
    this.errorMessage = opt.errorMessage || function(text){
        alert(text);
    }
    this.upload(opt);
}

uploader.prototype.upload = function(options) {
    var _this = this;
    var target = _this.target;
    var form = formDiv.replace('{{img}}', _this.isShow? imgDiv : '')
                        .replace('{{del}}', _this.isDel? delDiv : '')
                        .replace('{{classtype}}',_this.classtype ? _this.classtype : '')
                        .replace('{{width}}',_this.width)
                        .replace('{{height}}',_this.height)
                        .replace('{{within}}',_this.within)
                        .replace('{{force}}',_this.force)
    var form = $(form);
    var input = form.find('.mk-file');

    target.append(form);
    _this.form = form;

    if(!!(/bz-crazy-(android|ios)/).test(ua) && !!androidUA){
        input.on('click',function(){
            //等客户端把失败和取消的回调加上后启用beforAjax
            //_this.beforeAjax(); 
            var time = parseInt(new Date().getTime()/1000);
            window.Crazy.uploadImage(Config.getSiteUrl('image')+'/upload.php', 'tmp');
            window.uploadImageCallback = function(data){
                data = JSON.parse(data)
                if (data.error_code == 0) {
                    var url = data.data.url+'?'+time;
                    _this.showDel(url)
                    _this.upSuccse(url)
                } else {
                    _this.upError(data.error_message);
                };
            }
            event.preventDefault();
        })
    } else {
        _this.inputChange(form,input)
    }
};

uploader.prototype.inputChange = function(form,input){
    var _this = this;
    var limit = _this.limit;
    if(!!(/bz-crazy-(android|ios)/).test(ua) || ua.match(/micromessenger/gi)){
        input.attr('accept','')
    }
    input.on('change',function(){
        var text;
        var file;
        if (typeof FileReader !== "undefined") {
            file = this.files[0];
            // var arr = [];
            // for(var i in file){
            //      arr.push(i, file[i]);
            // }
            // alert(arr)

            // 检查类型
            if (!!file.type && file.type.indexOf('image') == -1) {
                text = '只能上传图片哦';
            } else if(!file.type && navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)){
                if(ua.match(/Android 4.2.1/)){
                    text = '请用摄像头拍摄上传';
                } else {
                    text = '请将图片文件放入相册，并从相册中选择';
                }
            } else if (file.size/1024 > limit * 1000) {
                text = '图片太大了哦，请上传小于' + limit + 'M的图片';
            } else if(ua.match(/Android 5.0.2/) && ua.match(/micromessenger/gi) && file.type.indexOf('png') != -1){
                text = '图片请上传jpg格式';
            }
        } else if(isIE()){
            var filePath = input[0].value;
            var filetype = filePath.substring(filePath.lastIndexOf(".")).toLowerCase();
            var reg = /(jpg|bmp|gif|jpeg|tif|png)$/;
            if (!reg.test(filetype)) {
                text = '只能上传小于'+limit+'M的图片哦'
            }
        } else {
            text = '请更换浏览器以获得更好体验'
        }

        if(!!text){
            _this.errorMessage(text)
        } else {
            var domain = Config.getMainDomain().replace(/:\d+/, '');
            document.domain = domain;
        
            if(!isIE() && _this.isCompress && file.size/1024 > _this.compressLimit){
                _this.api = /https/.test(location.href) ? 'https://image.' + domain + '/upload_base64.php' : 'http://image.' + domain + '/upload_base64.php';        
                _this.compress(file)
            } else {
                 _this.api =  /https/.test(location.href) ? 'https://image.' + domain + '/upload.php' : 'http://image.' + domain + '/upload.php';
                _this.uploaderAjax(form)
            }
        }
        input[0].value = '';
    });
}

uploader.prototype.uploaderAjax = function(form){
    var _this = this;
    _this.beforeAjax();
    var time = parseInt(new Date().getTime()/1000);
    if(isIE()){    
        _this.progress('上传中..');
        $.ajax({
            url: _this.api+'?__format=iframe',
            type: 'POST',
            iframe: true,
            form: form,
            success: function(data) {
                if (data.error_code == 0) {
                    var url = JSON.parse(data).data.url+'?'+time;
                    _this.showDel(url)
                    _this.upSuccse(url)
                } else {
                    _this.upError(data.error_message);
                };
            },
            error:function(data){
                _this.upError(data);
            }
        });
    } else {
        var fd = new FormData(form[0])
        $.ajax({
            url: _this.api,
            type: 'POST',
            data: fd,
            xhrFields: {
                withCredetials: true
            },
            xhr: function(){
                var xhr = $.ajaxSettings.xhr();
                if(!!_this.progress){
                    if (xhr.upload) {
                        if(ua.match(/Android 4.2.1/)){
                            _this.progress('上传中..');
                        }
                        xhr.upload.addEventListener('progress', function(event) {
                            var percent = 0;
                            var position = event.loaded || event.position;
                            var total = event.total;
                            if (event.lengthComputable) {
                                percent = Math.ceil(position / total * 100);
                                _this.progress(percent);
                            }
                        }, false);
                    }
                }
                return xhr;
            },
            processData: false, // 告诉jQuery不要去处理发送的数据
            contentType: false, // 告诉jQuery不要去设置Content-Type请求头
            success: function(data) {
                if (data.error_code == 0) {
                    var url = data.data.url+'?'+time;
                    _this.showDel(url)
                    _this.upSuccse(url)
                } else {
                    _this.upError(data.error_message);
                };
            },
            error:function(data){
                _this.upError(data);
            }
        });
    }
}

uploader.prototype.showDel =function(url){
    var _this = this;
    var form = _this.form;
    if(_this.isShow){
        var img = form.find('.mk-img');
        var _url = url;
        img.attr('src',_url);
        img.removeClass('hide');
        if(_this.isDel){
            var del = form.find('.mk-del');
            var input = form.find('.mk-file');
            del.css({
                'width':_this.delBtnW,
                'height':_this.delBtnW
            })
            input.addClass('hide');
            _this.formDel(_this.target);
        }
    }
}

uploader.prototype.formDel = function(target){
    var _this = this;
    var _target = target;
    var delBtn = _target.find('.mk-del');
    var img = _target.find('.mk-img');
    if(isIE()){
        delBtn.addClass('mk-del-ie')
    }
    img.on('click',function(){
        if(delBtn.hasClass('hide')){
            delBtn.removeClass('hide');
        } else{
            delBtn.addClass('hide')
        }
    })
    delBtn.on('click',function(){
        _target[0].parentNode.removeChild(_target[0]);
        _this.delSuccse();
    })
} 

uploader.prototype.compress = function(file){
    var _this = this;
    var reader = new FileReader();
    var t;

    _this.beforeCompress();
    if(!!_this.compressProgress){
        var i = 15;
        _this.compressProgress(i);
        t = setInterval(function(){
            if(i<95){
                var num = parseInt(Math.random()*8+1);
                i += num*num;
                _this.compressProgress(i);
            } else {
                window.clearInterval(t)
            }
        },50)
    }

    reader.readAsDataURL(file);

    reader.onload = function(){
        var result = this.result;
        var img = new Image();
        var canvas = document.createElement("canvas");
        var tCanvas = document.createElement("canvas");

        img.src = result;


        img.addEventListener("load",function(){
            var initSize = img.src.length //测试输出原尺寸
            var width = img.width;
            var height = img.height;


            //图片压缩到四百万像素以下，canvas限制五百万像素以下
            var ratio = width*height/4000000;
            if(ratio > 1){
                ratio = Math.sqrt(ratio);
                width /=ratio;
                height /=ratio;
            } else {
                ratio = 1;
            }

            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext('2d');

            //格式需要转jpg，铺一层底色避免png的透明区域变黑
            ctx.fillStyle = "#fff";
            ctx.fillRect(0,0,canvas.width,canvas.height);

            //如果图片像素大于100w则分割绘制
            var count = width * height/1000000;
            if(count>1){
                count = ~~(Math.sqrt(count)+1) //计算分割成多少块

                //计算每一块宽高
                var nw = ~~(width/count);
                var nh = ~~(height/count);
                var tctx = tCanvas.getContext('2d');
                tCanvas.width = nw;
                tCanvas.height = nh;

                for(var i = 0;i < count; i++){
                    for(var j = 0;j<count;j++){
                        tctx.drawImage(img,i*nw*ratio,j*nh*ratio,nw*ratio,nh*ratio,0,0,nw,nh);
                        ctx.drawImage(tCanvas,i*nw,j*nh,nw,nh);
                    }
                }
            } else {
                ctx.drawImage(img,0,0,width,height);
            }

            //进行压缩
            var ndata = canvas.toDataURL('image/jpeg',_this.compressRatio);
            // console.log(initSize);
            // console.log(ndata.length);
            // console.log(~~(100*(initSize-ndata.length)/initSize)+"%");



            if(!!_this.compressProgress){
                window.clearInterval(t);
                _this.compressProgress('100');
               _this.beforeAjax();
            } else {
               _this.beforeAjax();
            }


            var time = parseInt(new Date().getTime()/1000);

            $.ajax({
                url: _this.api,
                type: 'POST',
                data: {
                    file: ndata.replace("data:image/jpeg;base64,","").replace("data:image/png;base64,",""),
                    content_type: "image/jpeg",
                    class:'user'
                },
                xhrFields: {
                    withCredetials: true
                },
                xhr: function(){
                    var xhr = $.ajaxSettings.xhr();
                    if(!!_this.progress){
                        if (xhr.upload) {
                            if(ua.match(/Android 4.2.1/)){
                                _this.progress('上传中..');
                            }
                            xhr.upload.addEventListener('progress', function(event) {
                                var percent = 0;
                                var position = event.loaded || event.position;
                                var total = event.total;
                                if (event.lengthComputable) {
                                    percent = Math.ceil(position / total * 100);
                                    _this.progress(percent);
                                }
                            }, false);
                        }
                    }
                    return xhr;
                },
                // processData: false, // 告诉jQuery不要去处理发送的数据
                // contentType: false, // 告诉jQuery不要去设置Content-Type请求头
                success: function(data) {
                    if (data.error_code == 0) {
                        var url = data.data.url+'?'+time;
                        _this.showDel(url)
                        _this.upSuccse(url)
                    } else {
                        _this.upError(data.error_message);
                    };
                },
                error:function(data){
                    _this.upError(data);
                }
            });
        })
    }
}

module.exports = uploader;