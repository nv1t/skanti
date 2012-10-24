//----------------------------------------------------------------------------
//  Copyright (C) 2012  The skanti Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

//============================================================================
// PanelSection
//============================================================================

var skanti = (function (skanti) {

    var utils = skanti.utils;

    // Base PanelSection class

    var PanelSection = function (selector) {
        this.selector = selector;
        if (this.selector !== undefined) {
            this.element = $(selector);
            this.header = this.element.find('div.section_header');
            this.content = this.element.find('div.section_content');
            this.style();
            this.bind_events();
        }
        this.expanded = true;
    };


    PanelSection.prototype.style = function () {
        this.header.addClass('ui-widget ui-state-default ui-helper-clearfix');
        this.header.attr('title', "Click to Show/Hide Section");
        this.content.addClass('ui-widget section_content');
    };


    PanelSection.prototype.bind_events = function () {
        var that = this;
        this.header.click(function () {
            that.toggle();
        });
        this.header.hover(function () {
            that.header.toggleClass('ui-state-hover');
        });
    };


    PanelSection.prototype.expand = function () {
        if (!this.expanded) {
            this.content.slideDown('fast');
            this.expanded = true;
        };
    };


    PanelSection.prototype.collapse = function () {
        if (this.expanded) {
            this.content.slideUp('fast');
            this.expanded = false;
        };
    };


    PanelSection.prototype.toggle = function () {
        if (this.expanded === true) {
            this.collapse();
        } else {
            this.expand();
        };
    };


    PanelSection.prototype.create_children = function () {};


    // NotebookSection

    var NotebookSection = function () {
        PanelSection.apply(this, arguments);
    };


    NotebookSection.prototype = new PanelSection();


    NotebookSection.prototype.style = function () {
        PanelSection.prototype.style.apply(this);
        this.content.addClass('ui-helper-clearfix');
        this.content.find('div.section_row').addClass('ui-helper-clearfix');
        this.content.find('#new_open').buttonset();
        this.content.find('#new_notebook').attr('title', "Create a new notebook");
        this.content.find('#open_notebook').attr('title', "Open an existing notebook");
        this.content.find('#download_notebook').button();
        this.content.find('#download_notebook').attr('title',
            "Download the notebook in the specified format," +
            " either full ipynb notebook or as a Python script." +
            " Make sure to save before downloading, to ensure the file is up to date."
            );
        // upload notebook doesn't exist:
        this.content.find('#upload_notebook').button();
        this.content.find('#download_format').addClass('ui-widget ui-widget-content');
        this.content.find('#download_format option').addClass('ui-widget ui-widget-content');
    };


    NotebookSection.prototype.bind_events = function () {
        PanelSection.prototype.bind_events.apply(this);
        var that = this;
        this.content.find('#new_notebook').click(function () {
            window.open($('body').data('baseProjectUrl')+'new');
        });
        this.content.find('#open_notebook').click(function () {
            window.open($('body').data('baseProjectUrl'));
        });
        this.content.find('#download_notebook').click(function () {
            var format = that.content.find('#download_format').val();
        });
    };

    // ConfigSection

    var ConfigSection = function () {
        PanelSection.apply(this, arguments);
    };

    ConfigSection.prototype = new PanelSection();

    ConfigSection.prototype.style = function () {
        PanelSection.prototype.style.apply(this);
        this.content.addClass('ui-helper-clearfix');
        this.content.find('div.section_row').addClass('ui-helper-clearfix');

        this.content.find('#tooltipontab').attr('title', 'Show tooltip if you press <Tab> after "(" or a white space');
        this.content.find('#tooltipontab_label').attr('title', 'Show Tooltip when pressing Tab');

        this.content.find('#timebeforetooltip').addClass("ui-widget ui-widget-content");
        this.content.find('#timebeforetooltip').attr('title', 'Time before a tooltip auto-appear when "(" is pressed (negative value supress tooltip)');
        this.content.find('#timebeforetooltip_label').attr('title', 'Time before a tooltip auto-appear when "(" is pressed (negative value supress tooltip)');

        this.content.find('#smartcompleter').attr('title', 'When inside function call, completer try to propose kwargs first');
        this.content.find('#smartcompleter_label').attr('title', 'When inside function call, completer try to propose kwargs first');
    };


    ConfigSection.prototype.bind_events = function () {
        PanelSection.prototype.bind_events.apply(this);
        this.content.find('#tooltipontab').change(function () {
            var state = $('#tooltipontab').prop('checked');
            skanti.notebook.set_tooltipontab(state);
        });
        this.content.find('#timebeforetooltip').change(function () {
            var state = $('#timebeforetooltip').prop('value');
            skanti.notebook.set_timebeforetooltip(state);
        });
        this.content.find('#smartcompleter').change(function () {
            var state = $('#smartcompleter').prop('checked');
            skanti.notebook.set_smartcompleter(state);
        });
    };

    // CellSection

    var CellSection = function () {
        PanelSection.apply(this, arguments);
    };

    CellSection.prototype = new PanelSection();


    CellSection.prototype.style = function () {
        PanelSection.prototype.style.apply(this);
        this.content.addClass('ui-helper-clearfix');
        this.content.find('div.section_row').addClass('ui-helper-clearfix');
        this.content.find('#delete_cell').button();
        this.content.find('#delete_cell').attr('title', "Delete the selected cell");

        this.content.find('#insert').buttonset();
        this.content.find('#insert_cell_above').attr('title', "Insert new cell above selected");
        this.content.find('#insert_cell_below').attr('title', "Insert new cell below selected");

        this.content.find('#move').buttonset();
        this.content.find('#move_cell_up').attr('title', "Move selected cell up one in the Notebook");
        this.content.find('#move_cell_down').attr('title', "Move selected cell down one in the Notebook");

        this.content.find('#cell_type').buttonset();
        this.content.find('#to_markdown').attr('title', 'Change selected cell to markdown (for text)');
        this.content.find('#to_code').attr('title', 'Change selected cell to code (for execution)');

        this.content.find('#cell_output').buttonset();
        this.content.find('#toggle_output').attr('title', 'Toggle visibility of the output of code cells');
        this.content.find('#clear_all_output').attr('title', 'Clear output of all code cells (actually removes the data, unlike toggle)');

        this.content.find('#run_cells').buttonset();
        this.content.find('#run_selected_cell').attr('title', 'Submit the selected cell for execution');
        this.content.find('#run_all_cells').attr('title', 'Run *all* code cells in the notebook in order');
        this.content.find('#autoindent').attr('title', 'Autoindent code as-you-type');
        this.content.find('#autoindent_label').attr('title', 'Autoindent code as-you-type');
    };


    CellSection.prototype.bind_events = function () {
        PanelSection.prototype.bind_events.apply(this);
        this.content.find('#toggle_output').click(function () {
            skanti.notebook.toggle_output();
        });
        this.content.find('#clear_all_output').click(function () {
            skanti.notebook.clear_all_output();
        });
        this.content.find('#delete_cell').click(function () {
            skanti.notebook.delete_cell();
        });
        this.content.find('#insert_cell_above').click(function () {
            skanti.notebook.insert_code_cell_above();
        });
        this.content.find('#insert_cell_below').click(function () {
            skanti.notebook.insert_code_cell_below();
        });
        this.content.find('#move_cell_up').click(function () {
            skanti.notebook.move_cell_up();
        });
        this.content.find('#move_cell_down').click(function () {
            skanti.notebook.move_cell_down();
        });
        this.content.find('#to_code').click(function () {
            skanti.notebook.to_code();
        });
        this.content.find('#to_markdown').click(function () {
            skanti.notebook.to_markdown();
        });
        this.content.find('#run_selected_cell').click(function () {
            skanti.notebook.execute_selected_cell();
        });
        this.content.find('#run_all_cells').click(function () {
            skanti.notebook.execute_all_cells();
        });
        this.content.find('#autoindent').change(function () {
            var state = $('#autoindent').prop('checked');
            skanti.notebook.set_autoindent(state);
        });
        this.content.find('#tooltipontab').change(function () {
            var state = $('#tooltipontab').prop('checked');
            skanti.notebook.set_tooltipontab(state);
        });
    };


    // HelpSection

    var HelpSection = function () {
        PanelSection.apply(this, arguments);
    };


    HelpSection.prototype = new PanelSection();


    HelpSection.prototype.style = function () {
        PanelSection.prototype.style.apply(this);
        PanelSection.prototype.style.apply(this);
        this.content.addClass('ui-helper-clearfix');
        this.content.find('div.section_row').addClass('ui-helper-clearfix');
        this.content.find('#help_buttons0').buttonset();
        this.content.find('#help_buttons1').buttonset();
        this.content.find('#help_buttons2').buttonset();
        this.content.find('#python_help').attr('title', "Open the online Python documentation in a new tab");
        this.content.find('#ipython_help').attr('title', "Open the online skanti documentation in a new tab");
        this.content.find('#numpy_help').attr('title', "Open the online NumPy documentation in a new tab");
        this.content.find('#scipy_help').attr('title', "Open the online SciPy documentation in a new tab");
        this.content.find('#matplotlib_help').attr('title', "Open the online Matplotlib documentation in a new tab");
        this.content.find('#sympy_help').attr('title', "Open the online SymPy documentation in a new tab");
    };


    HelpSection.prototype.bind_events = function () {
        PanelSection.prototype.bind_events.apply(this);
    };


    // Set module variables

    skanti.PanelSection = PanelSection;
    skanti.NotebookSection = NotebookSection;
    skanti.CellSection = CellSection;
    skanti.ConfigSection = ConfigSection;
    skanti.HelpSection = HelpSection;

    return skanti;

}(skanti));

