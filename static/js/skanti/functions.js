function load(url) {
	$('body').append($('<script/>').attr('src',url));
}

function man(variable) {
	info(variable)
}

function info(variable) {
	var buff = '';
	var type = (typeof variable)
	if(variable != null && type != null) {
            color='red'
            out.append($('<p/>').append(                                    
                $('<span/>').attr('style','color:'+color+';font-weight:bold').html('Type:')
            ).append(type))

            if(type == 'string') {
                out.append($('<p/>').append(
                    $('<span/>').attr('style','color:'+color+';font-weight:bold').html('String Form:')
                ).append(variable))
                out.append($('<p/>').append(
                    $('<span/>').attr('style','color:'+color+';font-weight:bold').html('Length:')
                ).append(variable.length))
            }
            else if(type == 'number') {
                out.append('<p><span style="color:'+color+';font-weight:bold">String Form:</span> '+variable+'</p>');
            } 
            else if(type == 'object') {
                b = $('<span/>')
                out.append($('<p/>').append(
                        $('<span/>').attr('style','color:'+color+';font-weight:bold').html('String Form:')
                    ).append(b))
                
                b.append("<pre>{\n"+utils.dumpObj(variable)+"\n}</pre>")
            }
            else if(type == 'function') {
                try {
                    child = variable.toString();
                } catch (e) {
                    child = "<Unable to Evaluate>";
                }
                out.append($('<p/>').append(
                    $('<span/>').attr('style','color:'+color+';font-weight:bold').html('String Form:')
                ).append("<pre>"+child+"</pre>"))
            }
            
    }
}

function plot(points,style,_out) {
	if(!_out) _out = out
	_out.attr("style","width:600px;height:300px");
	if(!style) $.plot(_out,points);
	else $.plot(_out,points,style);
}
