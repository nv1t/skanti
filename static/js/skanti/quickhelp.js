//----------------------------------------------------------------------------
//  Copyright (C) 2012  The skanti Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

//============================================================================
// QuickHelp button
//============================================================================

var skanti = (function (skanti) {

    var QuickHelp = function (selector) {
        this.selector = selector;
        if (this.selector !== undefined) {
            this.element = $(selector);
            this.style();
            this.bind_events();
        }
    };

    QuickHelp.prototype.style = function () {
        this.element.find('button#quick_help').button();
        this.element.find('button#quick_help').attr('title', "Show/Hide the keyboard shortcuts for the skanti Notebook");
    };

    QuickHelp.prototype.bind_events = function () {
        var that = this;
        this.element.find("button#quick_help").click(function () {
            skanti.notebook.toggle_keyboard_shortcuts();
        });
    };

    // Set module variables
    skanti.QuickHelp = QuickHelp;

    return skanti;

}(skanti));
