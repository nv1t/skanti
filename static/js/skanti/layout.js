//----------------------------------------------------------------------------
//  Copyright (C) 2012  The skanti Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

//============================================================================
// Layout
//============================================================================

var skanti = (function (skanti) {

    var LayoutManager = function () {
        this.bind_events();
    };


    LayoutManager.prototype.bind_events = function () {
        $(window).resize($.proxy(this.do_resize,this));
    };


    LayoutManager.prototype.do_resize = function () {
        var win = $(window);
        var w = win.width();
        var h = win.height();
        var header_height = $('div#header').outerHeight(true);
        var app_height = h - header_height - 2;  // content height

        $('div#main_app').height(h) //app_height + 2);  // content+padding+border height
        $('div#notebook_panel').height(h); //app_height);
        $('div#notebook').height(h);
    };

    skanti.LayoutManager = LayoutManager;

    return skanti;

}(skanti));
