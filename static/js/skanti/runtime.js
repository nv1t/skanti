var skanti = (function (skanti) {
    var utils = skanti.utils;

    var Runtime = function() {
    };

    Runtime.prototype.execute = function(code,cell) {
        code = 'out = $("#'+cell.cell_id+'");'+code;
        $('#'+cell.cell_id).append($('<script/>').attr('type','text/javascript').html(code))
    }

    Runtime.prototype._parse = function(code) {

    }

    skanti.Runtime = Runtime;

    return skanti;
}(skanti));
