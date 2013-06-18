//----------------------------------------------------------------------------
//  Copyright (C) 2012  The skanti Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

//============================================================================
// On document ready
//============================================================================


$(document).ready(function () {
    $('div#header').addClass('border-box-sizing');
    $('div#main_app').addClass('border-box-sizing ui-widget ui-widget-content');
    $('div#notebook_panel').addClass('border-box-sizing ui-widget');

    skanti.layout_manager = new skanti.LayoutManager();
    skanti.runtime = new skanti.Runtime();
    //skanti.quick_help = new skanti.QuickHelp('span#quick_help_area');
    skanti.notebook = new skanti.Notebook('div#notebook');

    //skanti.layout_manager.do_resize();

    // These have display: none in the css file and are made visible here to prevent FLOUC.
    $('div#header').css('display','block');
    $('div#main_app').css('display','block');

    // Perform these actions after the notebook has been loaded.
    // We wait 100 milliseconds because the notebook scrolls to the top after a load
    // is completed and we need to wait for that to mostly finish.
    skanti.notebook.load_notebook(function () {
        setTimeout(function () {
            skanti.layout_manager.do_resize();
        },100);
    });


    $(window).error(function(msg, url, line){
        console.log(out)
        error = '<span style="color:red;">'
        error += 'Error in "'+msg['originalEvent']['filename']+'" on line '+msg['originalEvent']['lineno']+':';
        error += msg['originalEvent']['message'];
        error += '</span>';
        
        out.html("<p>"+error+"</p>");                                         
        out.parents('.vbox').show() //css('display','block');
        this.preventDefault();
        return false;
    });
});

