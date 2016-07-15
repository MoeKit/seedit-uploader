'use strict';
var $ = require('jquery');
require('./src/css/style.css')
require('iframe-ajax')($,{});
var Config = require('seedit-config');
var formDiv = require('./src/tpl/form.tpl')
var imgDiv = '<img class="mk-img hide">';
var delDiv = '<a href="javascript:void(0)" class="mk-del hide"></a>'
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
    this.type = opt.type || 'image';
    this.target = opt.target;
    this.isShow = opt.isShow || false;
    this.isDel = opt.isDel || false;
    this.delBtnW = opt.delBtnW || '30%';
    this.delSuccse = opt.delSuccse || function(){
    }
    this.upSuccse = opt.upSuccse || function(data){
        if(!isIE()){
            console.log(data)
        }
    }
    this.upError = opt.upError || function(data){
        if(!isIE()){
            console.log(data)
        }
    }
    this.beforeAjax = opt.beforeAjax || function(){
    }
    this.errorMessage = opt.errorMessage || function(text){
        alert(text);
    }

    this.upload(opt);
}

uploader.prototype.upload = function(options) {
    var _this = this;
    var target = $(this.target);
    var isDel = this.isDel;
    var isShow = this.isShow;
    var form = formDiv.replace('{{img}}', this.isShow? imgDiv : '')
                        .replace('{{del}}', this.isDel? delDiv : '');
    var $form = $(form);
    var input = $form.find('.mk-file');
    var img = $form.find('.mk-img');
    var del = $form.find('.mk-del');
    target.append($form);
    del.css({
        'width':this.delBtnW,
        'height':this.delBtnW
    })
    if(!!(/bz-crazy-(android|ios)/).test(ua) && !!androidUA){
        input.on('click',function(){
            window.Crazy.uploadImage(Config.getSiteUrl('image')+'/upload.php', 'tmp');
            window.uploadImageCallback = function(data){
                _this.upSuccse(data)
                if(isShow){
                    var _url = JSON.parse(data).data.url;
                    img.attr('src',_url);
                    img.removeClass('hide');
                    if(isDel){
                        input.addClass('hide');
                        _this.formDel(target);
                    } else {
                        input.val('')
                    }
                }
            }
            event.preventDefault();
        })
    } else {
        _this.inputChange($form)
    }
};
uploader.prototype.inputChange = function(form){
        var _this = this;
        var type = this.type;
        var limit = this.limit;
        var input = form.find('.mk-file');
        var copyInput = '<input name="file" type="file" id="file" class="mk-file" accept="image/*">';
        if(!!(/bz-crazy-(android|ios)/).test(ua) || navigator.userAgent.match(/micromessenger/gi)){
            input.attr('accept','')
        }
        input.on('change',function(){
            if (typeof FileReader !== "undefined") {
                var file = this.files[0];
                // 检查类型
                if (type === 'image') {
                    if (!!file.type && file.type.indexOf('image') == -1) {
                        input[0].outerHTML=copyInput;
                        _this.inputChange(form)
                        return _this.errorMessage('只能上传图片哦');
                    } else if(!file.type && navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)){
                        input[0].outerHTML=copyInput;
                        _this.inputChange(form)
                        return _this.errorMessage('请将图片文件放入相册，并从相册中选择')
                    }
                }
                // 检查大小,默认为3M
                if (file.size/1024 > limit * 1000) {
                    input[0].outerHTML=copyInput;
                    _this.inputChange(form)
                    return _this.errorMessage('图片太大了哦，请上传小于' + limit + 'M的图片');
                }
                _this.uploaderAjax(form)
            } else if(isIE()){
                var filePath = input[0].value;
                var filetype = filePath.substring(filePath.lastIndexOf(".")).toLowerCase();
                var reg = /(jpg|bmp|gif|jpeg|tif|png)$/;
                if (type === 'image' && !reg.test(filetype)) {
                    input[0].outerHTML=copyInput;
                    _this.inputChange(form)
                    return _this.errorMessage('只能上传图片哦');
                }
                _this.uploaderAjax(form)
            } else {
                _this.errorMessage('请更换浏览器以获得更好体验')
            }
        });
}
uploader.prototype.uploaderAjax = function(form){
    var _this = this;
    var target = $(this.target),
    domain = Config.getMainDomain().replace(/:\d+/, '');
    document.domain = domain;
    var isDel = this.isDel;
    var isShow = this.isShow;
    var img = form.find('.mk-img');
    var input = form.find('.mk-file')
    _this.beforeAjax();
    $.ajax({
        url: 'http://image.' + domain + '/upload.php?__format=iframe',
        type: 'POST',
        iframe: true,
        form: form,
        success: function(data) {
            if(isShow){
                if(isIE(6) || isIE(7)){
                    var json = (new Function("return"+data))();
                    var _url = json.data.url;
                } else {
                        var _url = JSON.parse(data).data.url;
                }
                img.attr('src',_url);
                img.removeClass('hide');
                if(isDel){
                    input.addClass('hide');
                    _this.formDel(target);
                } else {
                    input.val('')
                }
            }
            _this.upSuccse(data)
        },
        error:function(data){
            _this.upError(data);
        }
    });
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


module.exports = uploader;