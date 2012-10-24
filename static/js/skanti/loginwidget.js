//----------------------------------------------------------------------------
//  Copyright (C) 2012  The skanti Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

//============================================================================
// Login button
//============================================================================

var skanti = (function (skanti) {

    var LoginWidget = function (selector) {
        this.selector = selector;
        if (this.selector !== undefined) {
            this.element = $(selector);
            this.style();
            this.bind_events();
        }
    };

    LoginWidget.prototype.style = function () {
        this.element.find('button#logout').button();
        this.element.find('button#login').button();
    };
    LoginWidget.prototype.bind_events = function () {
        var that = this;
        this.element.find("button#logout").click(function () {
            window.location = "/logout";
        });
        this.element.find("button#login").click(function () {
            window.location = "/login";
        });
    };

    // Set module variables
    skanti.LoginWidget = LoginWidget;

    return skanti;

}(skanti));
