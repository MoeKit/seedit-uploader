var $ = require('jquery');
require('iframe-ajax')($);
var Config = require('seedit-config');

module.exports = function(options, cb) {
    var $target = $(options.target),
        width = $target.width(),
        height = $target.height(),
        domain = Config.getMainDomain().replace(/:\d+/, '');
    document.domain = domain;
    var $form = $('<form class="mk-uploader-form" enctype="multipart/form-data" method="POST" style="position:relative;opacity:0;overflow:hidden;width:' + width + 'px;height:' + height + 'px;overflow:hidden;"><input name="file" type="file" id="file" class="mk-file" style="display: block;cursor:pointer;width: ' + (width + 80) + 'px;height: ' + height + 'px;position:absolute;left:-80px;"><input type="hidden" name="class" value="user"></form>');
    var $input = $form.find('.mk-file');
    $target.append($form);
    $input.change(function() {
        var val = $input.val();
        if (typeof FileReader !== "undefined") {
            var file = this.files[0];
            // 检查类型
            if (options.type === 'image') {
                if (file.type !== 'image/png' && file.type !== 'image/jpeg' && file.type !== 'image/gif') {
                    return alert('只能上传图片哦');
                }
            }
            // 检查大小,默认为3M
            var limit = options.limit || 3;
            if (file.size > limit * 1024 * 1024) {
                return alert('图片太大了哦，请上传小于' + limit + 'M的图片');
            }

        }

        $.ajax({
            url: 'http://image.' + domain + '/upload.php?__format=iframe',
            type: 'POST',
            iframe: true,
            form: $form,
            success: function(data) {
                cb(data);
            }
        });
    });
};