var skanti = (function (skanti) {
    //var utils = skanti.utils;

    var Runtime = function() {
    };

    Runtime.prototype.execute = function(code,cell) {
        if(code.slice(-1) == "?") {
            code = "info("+code.slice(0,-1)+")";
        }
        code = 'out = $("#'+cell.cell_id+'"); eval("'+code+'");';
        $('#'+cell.cell_id).append($('<script/>').attr('type','text/javascript').html(code))
    }

    Runtime.prototype._parse = function(code) {

    }

    skanti.Runtime = Runtime;

    return skanti;
}(skanti));
