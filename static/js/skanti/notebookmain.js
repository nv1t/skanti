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
    if (window.MathJax){ 
        // MathJax loaded
        MathJax.Hub.Config({
            tex2jax: {
                inlineMath: [ ['$','$'], ["\\(","\\)"] ],
                displayMath: [ ['$$','$$'], ["\\[","\\]"] ]
            },
            displayAlign: 'left', // Change this to 'center' to center equations.
            "HTML-CSS": {
                styles: {'.MathJax_Display': {"margin": 0}}
            }
        });
    }else if (window.mathjax_url != ""){
        // Don't have MathJax, but should. Show dialog.
/*
        var dialog = $('<div></div>')
            .append(
                $("<p></p>").addClass('dialog').html(
                    "Math/LaTeX rendering will be disabled."
                )
            ).append(
                $("<p></p>").addClass('dialog').html(
                    "If you have administrative access to the notebook server and" +
                    " a working internet connection, you can install a local copy" +
                    " of MathJax for offline use with the following command on the server" +
                    " at a Python or skanti prompt:"
                )
            ).append(
                $("<pre></pre>").addClass('dialog').html(
                    ">>> from skanti.external import mathjax; mathjax.install_mathjax()"
                )
            ).append(
                $("<p></p>").addClass('dialog').html(
                    "This will try to install MathJax into the skanti source directory."
                )
            ).append(
                $("<p></p>").addClass('dialog').html(
                    "If skanti is installed to a location that requires" +
                    " administrative privileges to write, you will need to make this call as" +
                    " an administrator, via 'sudo'."
                )
            ).append(
                $("<p></p>").addClass('dialog').html(
                    "When you start the notebook server, you can instruct it to disable MathJax support altogether:"
                )
            ).append(
                $("<pre></pre>").addClass('dialog').html(
                    "$ ipython notebook --no-mathjax"
                )
            ).append(
                $("<p></p>").addClass('dialog').html(
                    "which will prevent this dialog from appearing."
                )
            ).dialog({
                title: "Failed to retrieve MathJax from '" + window.mathjax_url + "'",
                width: "70%",
                modal: true,
            })
*/
    }else{
        // No MathJax, but none expected. No dialog.
    }
    
    skanti.markdown_converter = new Markdown.Converter();
    skanti.read_only = false; 
    //$('meta[name=read_only]').attr("content") == 'True';

    $('div#header').addClass('border-box-sizing');
    $('div#main_app').addClass('border-box-sizing ui-widget ui-widget-content');
    $('div#notebook_panel').addClass('border-box-sizing ui-widget');

    skanti.layout_manager = new skanti.LayoutManager();
    skanti.pager = new skanti.Pager('div#pager', 'div#pager_splitter');
    skanti.runtime = new skanti.Runtime();
    skanti.left_panel = new skanti.LeftPanel('div#left_panel', 'div#left_panel_splitter');
    skanti.quick_help = new skanti.QuickHelp('span#quick_help_area');
    skanti.print_widget = new skanti.PrintWidget('span#print_widget');
    skanti.notebook = new skanti.Notebook('div#notebook');

    skanti.layout_manager.do_resize();

    // These have display: none in the css file and are made visible here to prevent FLOUC.
    $('div#header').css('display','block');

    if(skanti.read_only){
        // hide various elements from read-only view
        skanti.quick_help.element.addClass('hidden'); // shortcuts are disabled in read_only
        $('div#pager').remove();
        $('div#pager_splitter').remove();
        $('button#new_notebook').addClass('hidden');
        $('div#cell_section').addClass('hidden');
        $('div#config_section').addClass('hidden');

        // set the notebook name field as not modifiable
        $('#notebook_name').attr('disabled','disabled')

        // left panel starts collapsed, but the collapse must happen after
        // elements start drawing.  Don't draw contents of the panel until
        // after they are collapsed
        skanti.left_panel.left_panel_element.css('visibility', 'hidden');
    }

    $('div#main_app').css('display','block');

    // Perform these actions after the notebook has been loaded.
    // We wait 100 milliseconds because the notebook scrolls to the top after a load
    // is completed and we need to wait for that to mostly finish.
    skanti.notebook.load_notebook(function () {
        setTimeout(function () {
            skanti.layout_manager.do_resize();
            skanti.pager.collapse();
            if(skanti.read_only){
                // collapse the left panel on read-only
                skanti.left_panel.collapse();
                // and finally unhide the panel contents after collapse
                setTimeout(function(){
                    skanti.left_panel.left_panel_element.css('visibility', 'visible');
                }, 200);
            }
        },100);
    });


		$(window).error(function(msg, url, line){
        skanti.pager.expand()
        skanti.pager.append_html('<span style="color:red;">')
        skanti.pager.append_html('Error in "'+msg['originalEvent']['filename']+'" on line '+msg['originalEvent']['lineno']+':')
        skanti.pager.append_html(msg['originalEvent']['message'])
        skanti.pager.append_html('</span>')
        
				console.log(msg);
        //alert( { msg: msg, url: url, line: line });
        //this.preventDefault();
        //return false;
    });


/*
		window.onerror(function(e) {
        skanti.pager.expand();
        skanti.pager.append_html("<span style='color:red'>"+e+"</span>");
		});
*/

});

