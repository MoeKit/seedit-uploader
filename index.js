var $ = require('jquery');
require('iframe-ajax')($);
var Config = require('seedit-config');

module.exports = function(target, cb) {
    var $target = $(target),
        width = $target.width(),
        height = $target.height(),
        domain = Config.getMainDomain().replace(/:\d+/, '');
    document.domain = domain;
    var $form = $('<form id="form" enctype="multipart/form-data" method="POST" style="opacity:0;"><input name="file" type="file" id="file" class="mk-file" style="display: block;width: ' + width + 'px;height: ' + height + 'px;"><input type="hidden" name="class" value="user"></form>');
    var $input = $form.find('.mk-file');
    $target.append($form);
    $input.change(function() {

        $.ajax({
            url: 'http://image.' + domain + '/upload.php?__format=iframe',
            type: 'POST',
            iframe: true,
            form: '#form',
            success: function(data) {
                cb(data);
            }
        });
    });
};