//----------------------------------------------------------------------------
//  Copyright (C) 2012  The skanti Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

//============================================================================
// Notebook
//============================================================================

var skanti = (function (skanti) {

    var utils = skanti.utils;

    var Notebook = function (selector) {
        this.read_only = skanti.read_only;
        this.element = $(selector);
        this.element.scroll();
        this.element.data("notebook", this);
        this.next_prompt_number = 1;
        this.dirty = false;
        this.msg_cell_map = {};
        this.metadata = {};
        this.control_key_active = false;
        this.style();
        this.create_elements();
        this.bind_events();
        this.set_tooltipontab(true);
        this.set_smartcompleter(true);
        this.set_timebeforetooltip(1200);
    };


    Notebook.prototype.style = function () {
        $('div#notebook').addClass('border-box-sizing');
    };


    Notebook.prototype.create_elements = function () {
        // We add this end_space div to the end of the notebook div to:
        // i) provide a margin between the last cell and the end of the notebook
        // ii) to prevent the div from scrolling up when the last cell is being
        // edited, but is too low on the page, which browsers will do automatically.
        var that = this;
        var end_space = $('<div class="end_space"></div>').height("30%");
        end_space.dblclick(function (e) {
            if (that.read_only) return;
            var ncells = that.ncells();
            that.insert_code_cell_below(ncells-1);
        });
        this.element.append(end_space);
        $('div#notebook').addClass('border-box-sizing');
    };


    Notebook.prototype.bind_events = function () {
        var that = this;
        $(document).keydown(function (event) {
            // console.log(event);
            if (that.read_only) return true;
            if (event.which === 27) {
                // Intercept escape at highest level to avoid closing 
                // websocket connection with firefox
                event.preventDefault();
            }
            if (event.which === 38 && !event.shiftKey) {
                var cell = that.selected_cell();
                if (cell.at_top()) {
                    event.preventDefault();
                    that.select_prev();
                };
            } else if (event.which === 40 && !event.shiftKey) {
                var cell = that.selected_cell();
                if (cell.at_bottom()) {
                    event.preventDefault();
                    that.select_next();
                };
            } else if (event.which === 13 && event.shiftKey) {
                that.execute_selected_cell();
                return false;
            } else if (event.which === 13 && event.ctrlKey) {
                that.execute_selected_cell({terminal:true});
                return false;
            } else if (event.which === 77 && event.ctrlKey) {
                that.control_key_active = true;
                return false;
            } else if (event.which === 68 && that.control_key_active) {
                // Delete selected cell = d
                that.delete_cell();
                that.control_key_active = false;
                return false;
            } else if (event.which === 65 && that.control_key_active) {
                // Insert code cell above selected = a
                that.insert_code_cell_above();
                that.control_key_active = false;
                return false;
            } else if (event.which === 66 && that.control_key_active) {
                // Insert code cell below selected = b
                that.insert_code_cell_below();
                that.control_key_active = false;
                return false;
            } else if (event.which === 67 && that.control_key_active) {
                // To code = c
                that.to_code();
                that.control_key_active = false;
                return false;
            } else if (event.which === 77 && that.control_key_active) {
                // To markdown = m
                that.to_markdown();
                that.control_key_active = false;
                return false;
            } else if (event.which === 84 && that.control_key_active) {
                // Toggle output = t
                that.toggle_output();
                that.control_key_active = false;
                return false;
            } else if (event.which === 74 && that.control_key_active) {
                // Move cell down = j
                that.move_cell_down();
                that.control_key_active = false;
                return false;
            } else if (event.which === 75 && that.control_key_active) {
                // Move cell up = k
                that.move_cell_up();
                that.control_key_active = false;
                return false;
            } else if (event.which === 80 && that.control_key_active) {
                // Select previous = p
                that.select_prev();
                that.control_key_active = false;
                return false;
            } else if (event.which === 78 && that.control_key_active) {
                // Select next = n
                that.select_next();
                that.control_key_active = false;
                return false;
            } else if (event.which === 76 && that.control_key_active) {
                // Toggle line numbers = l
                that.cell_toggle_line_numbers();
                that.control_key_active = false;
                return false;
            } else if (event.which === 72 && that.control_key_active) {
                // Show keyboard shortcuts = h
                that.toggle_keyboard_shortcuts();
                that.control_key_active = false;
                return false;
            } else if (that.control_key_active) {
                that.control_key_active = false;
                return true;
            };
            return true;
        });

        $(window).bind('beforeunload', function () {
            if (that.dirty && ! that.read_only) {
                return "You have unsaved changes that will be lost if you leave this page.";
            };
            // Null is the *only* return value that will make the browser not
            // pop up the "don't leave" dialog.
            return null;
        });
    };


    Notebook.prototype.toggle_keyboard_shortcuts = function () {
        // toggles display of keyboard shortcut dialog
        var that = this;
        if ( this.shortcut_dialog ){
            // if dialog is already shown, close it
            this.shortcut_dialog.dialog("close");
            this.shortcut_dialog = null;
            return;
        }
        var dialog = $('<div/>');
        this.shortcut_dialog = dialog;
        var shortcuts = [
            {key: 'Shift-Enter', help: 'run cell'},
            {key: 'Ctrl-Enter', help: 'run cell in-place'},
            {key: 'Ctrl-m d', help: 'delete cell'},
            {key: 'Ctrl-m a', help: 'insert cell above'},
            {key: 'Ctrl-m b', help: 'insert cell below'},
            {key: 'Ctrl-m t', help: 'toggle output'},
            {key: 'Ctrl-m l', help: 'toggle line numbers'},
            {key: 'Ctrl-m s', help: 'save notebook'},
            {key: 'Ctrl-m j', help: 'move cell down'},
            {key: 'Ctrl-m k', help: 'move cell up'},
            {key: 'Ctrl-m c', help: 'code cell'},
            {key: 'Ctrl-m m', help: 'markdown cell'},
            {key: 'Ctrl-m p', help: 'select previous'},
            {key: 'Ctrl-m n', help: 'select next'},
            {key: 'Ctrl-m h', help: 'show keyboard shortcuts'}
        ];
        for (var i=0; i<shortcuts.length; i++) {
            dialog.append($('<div>').
                append($('<span/>').addClass('shortcut_key').html(shortcuts[i].key)).
                append($('<span/>').addClass('shortcut_descr').html(' : ' + shortcuts[i].help))
            );
        };
        dialog.bind('dialogclose', function(event) {
            // dialog has been closed, allow it to be drawn again.
            that.shortcut_dialog = null;
        });
        dialog.dialog({title: 'Keyboard shortcuts'});
    };


    Notebook.prototype.scroll_to_bottom = function () {
        this.element.animate({scrollTop:this.element.get(0).scrollHeight}, 0);
    };


    Notebook.prototype.scroll_to_top = function () {
        this.element.animate({scrollTop:0}, 0);
    };


    // Cell indexing, retrieval, etc.


    Notebook.prototype.cell_elements = function () {
        return this.element.children("div.cell");
    };


    Notebook.prototype.ncells = function (cell) {
        return this.cell_elements().length;
    };


    // TODO: we are often calling cells as cells()[i], which we should optimize
    // to cells(i) or a new method.
    Notebook.prototype.cells = function () {
        return this.cell_elements().toArray().map(function (e) {
            return $(e).data("cell");
        });
    };


    Notebook.prototype.find_cell_index = function (cell) {
        var result = null;
        this.cell_elements().filter(function (index) {
            if ($(this).data("cell") === cell) {
                result = index;
            };
        });
        return result;
    };


    Notebook.prototype.index_or_selected = function (index) {
        return index || this.selected_index() || 0;
    };


    Notebook.prototype.select = function (index) {
        if (index !== undefined && index >= 0 && index < this.ncells()) {
            if (this.selected_index() !== null) {
                this.selected_cell().unselect();
            };
            this.cells()[index].select();
        };
        return this;
    };


    Notebook.prototype.select_next = function () {
        var index = this.selected_index();
        if (index !== null && index >= 0 && (index+1) < this.ncells()) {
            this.select(index+1);
        };
        return this;
    };


    Notebook.prototype.select_prev = function () {
        var index = this.selected_index();
        if (index !== null && index >= 0 && (index-1) < this.ncells()) {
            this.select(index-1);
        };
        return this;
    };


    Notebook.prototype.selected_index = function () {
        var result = null;
        this.cell_elements().filter(function (index) {
            if ($(this).data("cell").selected === true) {
                result = index;
            };
        });
        return result;
    };


    Notebook.prototype.cell_for_msg = function (msg_id) {
        var cell_id = this.msg_cell_map[msg_id];
        var result = null;
        this.cell_elements().filter(function (index) {
            cell = $(this).data("cell");
            if (cell.cell_id === cell_id) {
                result = cell;
            };
        });
        return result;
    };


    Notebook.prototype.selected_cell = function () {
        return this.cell_elements().eq(this.selected_index()).data("cell");
    };


    // Cell insertion, deletion and moving.


    Notebook.prototype.delete_cell = function (index) {
        var i = index || this.selected_index();
        if (i !== null && i >= 0 && i < this.ncells()) {
            this.cell_elements().eq(i).remove();
            if (i === (this.ncells())) {
                this.select(i-1);
            } else {
                this.select(i);
            };
        };
        this.dirty = true;
        return this;
    };


    Notebook.prototype.append_cell = function (cell) {
        this.element.find('div.end_space').before(cell.element);
        this.dirty = true;
        return this;
    };


    Notebook.prototype.insert_cell_below = function (cell, index) {
        var ncells = this.ncells();
        if (ncells === 0) {
            this.append_cell(cell);
            return this;
        };
        if (index >= 0 && index < ncells) {
            this.cell_elements().eq(index).after(cell.element);
        };
        this.dirty = true;
        return this;
    };


    Notebook.prototype.insert_cell_above = function (cell, index) {
        var ncells = this.ncells();
        if (ncells === 0) {
            this.append_cell(cell);
            return this;
        };
        if (index >= 0 && index < ncells) {
            this.cell_elements().eq(index).before(cell.element);
        };
        this.dirty = true;
        return this;
    };


    Notebook.prototype.move_cell_up = function (index) {
        var i = index || this.selected_index();
        if (i !== null && i < this.ncells() && i > 0) {
            var pivot = this.cell_elements().eq(i-1);
            var tomove = this.cell_elements().eq(i);
            if (pivot !== null && tomove !== null) {
                tomove.detach();
                pivot.before(tomove);
                this.select(i-1);
            };
        };
        this.dirty = true;
        return this;
    };


    Notebook.prototype.move_cell_down = function (index) {
        var i = index || this.selected_index();
        if (i !== null && i < (this.ncells()-1) && i >= 0) {
            var pivot = this.cell_elements().eq(i+1);
            var tomove = this.cell_elements().eq(i);
            if (pivot !== null && tomove !== null) {
                tomove.detach();
                pivot.after(tomove);
                this.select(i+1);
            };
        };
        this.dirty = true;
        return this;
    };


    Notebook.prototype.sort_cells = function () {
        var ncells = this.ncells();
        var sindex = this.selected_index();
        var swapped;
        do {
            swapped = false;
            for (var i=1; i<ncells; i++) {
                current = this.cell_elements().eq(i).data("cell");
                previous = this.cell_elements().eq(i-1).data("cell");
                if (previous.input_prompt_number > current.input_prompt_number) {
                    this.move_cell_up(i);
                    swapped = true;
                };
            };
        } while (swapped);
        this.select(sindex);
        return this;
    };


    Notebook.prototype.insert_code_cell_above = function (index) {
        // TODO: Bounds check for i
        var i = this.index_or_selected(index);
        var cell = new skanti.CodeCell(this);
        cell.set_input_prompt();
        this.insert_cell_above(cell, i);
        this.select(this.find_cell_index(cell));
        return cell;
    };


    Notebook.prototype.insert_code_cell_below = function (index) {
        // TODO: Bounds check for i
        var i = this.index_or_selected(index);
        var cell = new skanti.CodeCell(this);
        cell.set_input_prompt();
        this.insert_cell_below(cell, i);
        this.select(this.find_cell_index(cell));
        return cell;
    };


    Notebook.prototype.to_code = function (index) {
        // TODO: Bounds check for i
        var i = this.index_or_selected(index);
        var source_element = this.cell_elements().eq(i);
        var source_cell = source_element.data("cell");
        if (source_cell instanceof skanti.HTMLCell || 
            source_cell instanceof skanti.MarkdownCell) {
            this.insert_code_cell_below(i);
            var target_cell = this.cells()[i+1];
            target_cell.set_code(source_cell.get_source());
            source_element.remove();
            target_cell.select();
        };
        this.dirty = true;
    };


    // Cell collapsing and output clearing

    Notebook.prototype.collapse = function (index) {
        var i = this.index_or_selected(index);
        this.cells()[i].collapse();
        this.dirty = true;
    };


    Notebook.prototype.expand = function (index) {
        var i = this.index_or_selected(index);
        this.cells()[i].expand();
        this.dirty = true;
    };


    Notebook.prototype.toggle_output = function (index) {
        var i = this.index_or_selected(index);
        this.cells()[i].toggle_output();
        this.dirty = true;
    };


    Notebook.prototype.set_timebeforetooltip = function (time) {
        console.log("change time before tooltip to : "+time);
        this.time_before_tooltip = time;
    };

    Notebook.prototype.set_tooltipontab = function (state) {
        console.log("change tooltip on tab to : "+state);
        this.tooltip_on_tab = state;
    };

    Notebook.prototype.set_smartcompleter = function (state) {
        console.log("Smart completion (kwargs first) changed to  to : "+state);
        this.smart_completer = state;
    };

    Notebook.prototype.set_autoindent = function (state) {
        var cells = this.cells();
        len = cells.length;
        for (var i=0; i<len; i++) {
            cells[i].set_autoindent(state);
        };
    };


    Notebook.prototype.clear_all_output = function () {
        var ncells = this.ncells();
        var cells = this.cells();
        for (var i=0; i<ncells; i++) {
            if (cells[i] instanceof skanti.CodeCell) {
                cells[i].clear_output(true,true,true);
            }
        };
        this.dirty = true;
    };

    // Other cell functions: line numbers, ...

    Notebook.prototype.cell_toggle_line_numbers = function() {
        this.selected_cell().toggle_line_numbers();
    };

    Notebook.prototype.handle_output = function (cell, msg_type, content) {
        var json = {};
        json.output_type = msg_type;
        json.content = content;
        json.javascript=true;
        json.prompt_number = this.next_prompt_number;
        cell.append_output(json);
        this.dirty = true;
    };

    Notebook.prototype.execute = function(code) {

    }

    Notebook.prototype.execute_selected_cell = function (options) {
        // add_new: should a new cell be added if we are at the end of the nb
        // terminal: execute in terminal mode, which stays in the current cell
        default_options = {terminal: false, add_new: true};
        $.extend(default_options, options);
        var that = this;
        var cell = that.selected_cell();
        var cell_index = that.find_cell_index(cell);
        if (cell instanceof skanti.CodeCell) {
            cell.clear_output(true, true, true);
            //cell.set_input_prompt('*');
            cell.element.addClass("running");
            var code = cell.get_code();
            var msg_id = utils.uuid(); 
            that.msg_cell_map[msg_id] = cell.cell_id;
            this.handle_output(cell,'jsout',code);
        } else if (cell instanceof skanti.HTMLCell) {
            cell.render();
        }
        if (default_options.terminal) {
            cell.select_all();
        } else {
            if ((cell_index === (that.ncells()-1)) && default_options.add_new) {
                that.insert_code_cell_below();
                // If we are adding a new cell at the end, scroll down to show it.
                that.scroll_to_bottom();
            } else {
                that.select(cell_index+1);
            };
        };
        this.next_prompt_number++;
        this.dirty = true;
    };


    Notebook.prototype.execute_all_cells = function () {
        var ncells = this.ncells();
        for (var i=0; i<ncells; i++) {
            this.select(i);
            this.execute_selected_cell({add_new:false});
        };
        this.scroll_to_bottom();
    };


    Notebook.prototype.request_tool_tip = function (cell,func) { };

    Notebook.prototype.complete_cell = function (cell, line, cursor_pos) { };

    // Persistance and loading
    Notebook.prototype.fromJSON = function (data) {
        var ncells = this.ncells();
        var i;
        for (i=0; i<ncells; i++) {
            // Always delete cell 0 as they get renumbered as they are deleted.
            this.delete_cell(0);
        };
        // Save the metadata
        this.metadata = data.metadata;
        // Only handle 1 worksheet for now.
        var worksheet = data.worksheets[0];
        if (worksheet !== undefined) {
            var new_cells = worksheet.cells;
            ncells = new_cells.length;
            var cell_data = null;
            var new_cell = null;
            for (i=0; i<ncells; i++) {
                cell_data = new_cells[i];
                new_cell = this.insert_code_cell_below();
                new_cell.fromJSON(cell_data);
            };          
        };
    };


    Notebook.prototype.toJSON = function () {
        var cells = this.cells();
        var ncells = cells.length;
        cell_array = new Array(ncells);
        for (var i=0; i<ncells; i++) {
            cell_array[i] = cells[i].toJSON();
        };
        data = {
            // Only handle 1 worksheet for now.
            worksheets : [{cells:cell_array}],
            metadata : this.metadata
        };
        return data;
    };

    Notebook.prototype.save_notebook = function (){ };


    Notebook.prototype.notebook_saved = function (data, status, xhr) {};


    Notebook.prototype.notebook_save_failed = function (xhr, status, error_msg) { };


    Notebook.prototype.load_notebook = function (callback) {
        this.insert_code_cell_below();
        this.notebook_loaded();
        callback();
    };


    Notebook.prototype.notebook_loaded = function () {
        //var allowed = xhr.getResponseHeader('Allow');
        //this.fromJSON(data);
        if (this.ncells() === 0) {
            this.insert_code_cell_below();
        };
        this.dirty = false;
        // fromJSON always selects the last cell inserted. We need to wait
        // until that is done before scrolling to the top.
        setTimeout(function () {
            skanti.notebook.select(0);
            skanti.notebook.scroll_to_top();
        }, 50);
    };

    skanti.Notebook = Notebook;


    return skanti;

}(skanti));

