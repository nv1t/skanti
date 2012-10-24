function load(url) {
	$('body').append($('<script/>').attr('src',url));
}

function dbQuery(q) {
	//load('db.php?q='+encodeURI(q))
	return {}//JSON.parse(_);
}

/*
function mailbyhour() {
	res = dbQuery('select hour(timestamp) as h, count(*) as cnt from history group by hour(timestamp)');
	var d1 = [];
	for( i in res ) {
		d1.push([res[i]['h'],res[i]['cnt']])
	}
	plot([d1]);
}
*/

function man(variable) {
	info(variable)
}

function info(variable) {
	var buff = '';
	var type = (typeof variable)
	if(variable != null && type != null) {
            if(type == 'string') {
                color = 'red';
                out.append($('<p/>').append(
                    $('<span/>').attr('style','color:'+color+';font-weight:bold').html('Type:')
                ).append(type))
                out.append($('<p/>').append(
                    $('<span/>').attr('style','color:'+color+';font-weight:bold').html('String Form:')
                ).append(variable))
                out.append($('<p/>').append(
                    $('<span/>').attr('style','color:'+color+';font-weight:bold').html('Length:')
                ).append(variable.length))
            }
            else if(type == 'undefined') {
                color = 'red';
                out.append($('<p/>').append(
                    $('<span/>').attr('style','color:'+color+';font-weight:bold').html('Type:')
                ).append(type))
            }
            else if(type == 'number') {
                color = 'red';
                out.append('<p><span style="color:'+color+';font-weight:bold">Type:</span> '+type+'</p>');
                out.append('<p><span style="color:'+color+';font-weight:bold">String Form:</span> '+variable+'</p>');
            } 
            else if(type == 'object') {
                color = 'red';
                out.append(
                    $('<p/>').append(
                        $('<span/>').attr('style','color:'+color+';font-weight:bold').html('Type:')
                    ).append(type)
                )
                b = $('<span/>')
                out.append($('<p/>').append(
                        $('<span/>').attr('style','color:'+color+';font-weight:bold').html('String Form:')
                    ).append(b))
                
                b.append("<pre>{\n"+dumpObj(variable)+"\n}</pre>")
            }
            else if(type == 'function') {
                color = 'red';
                try {
                    child = variable.toString();
                } catch (e) {
                    child = "<Unable to Evaluate>";
                }
                out.append(
                    $('<p/>').append(
                        $('<span/>').attr('style','color:'+color+';font-weight:bold').html('Type:')
                    ).append(type)
                )
                out.append($('<p/>').append(
                        $('<span/>').attr('style','color:'+color+';font-weight:bold').html('String Form:')
                    ).append("<pre>"+child+"</pre>"))
            } else {
                color = 'red';
                out.append($('<p/>').append(
                    $('<span/>').attr('style','color:'+color+';font-weight:bold').html('Type:')
                ).append(type))
            }
    }
}

function plot(points,style,_out) {
	if(!_out) _out = out
	_out.attr("style","width:600px;height:300px");
	if(!style) $.plot(_out,points);
	else $.plot(_out,points,style);
}



       function dumpObj(obj, name, indent, depth) {
							if(!depth) depth = 1
              if(!indent) indent = ''
              if (depth > 1) {
                     return indent + name + ": <Maximum Depth Reached>\n";
              }
              if (typeof obj == "object") {
                     var child = null;
                     var output = ''; //indent + name + "\n";
                     indent += "    ";
                     for (var item in obj)
                     {
                           try {
                                  child = obj[item];
                           } catch (e) {
                                  child = "<Unable to Evaluate>";
                           }
                           if (typeof child == "object") {
                                  output += indent + item + ": {\"object\"},\n"; //dmpObj(child, item, indent, depth + 1);
                           } else if(typeof child == "function") {

                                  output += indent + item + ": function(),\n";
                           }else {
                                  output += indent + item + ": " + child + ",\n";
                           }
                     }
                     return output;
              } else {
                     return obj;
              }
       }
