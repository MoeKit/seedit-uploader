var $ = require('jquery');
require('iframe-ajax')($);
var Config = require('seedit-config');

module.exports = function(target, cb) {
    var $target = $(target),
        width = $target.width(),
        height = $target.height(),
        domain = Config.getMainDomain().replace(/:\d+/, '');
    document.domain = domain;
    var $form = $('<form class="mk-uploader-form" enctype="multipart/form-data" method="POST" style="position:relative;opacity:0;overflow:hidden;width:'+width+'px;height:'+height+'px;overflow:hidden;"><input name="file" type="file" id="file" class="mk-file" style="display: block;cursor:pointer;width: ' + (width+80) + 'px;height: ' + height + 'px;position:absolute;left:-80px;"><input type="hidden" name="class" value="user"></form>');
    var $input = $form.find('.mk-file');
    $target.append($form);
    $input.change(function() {
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