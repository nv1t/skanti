load("http://nuit.homeunix.net/workbench/r0cket.tracking/wrapper.php");
_ = JSON.parse(_)
reader = {}
for(i in _['reader']) {
	reader[_['reader'][i]['id']] = _['reader'][i];
}
/*
n = Timer.run(out,function(out) {
load("http://nuit.homeunix.net/workbench/r0cket.tracking/wrapper.php");
var tags = JSON.parse(_)
var i;

var d = [];
for(i in reader) {
	d[i] = [];
}
for(i in tags.tag) {
    d[tags.tag[i].reader].push([tags.tag[i].px, tags.tag[i].py])
}
plot([d1],{
    xaxis:{
        min:200,max:800
    },
    yaxis:{
        min:100,max:900
    },
    series:{
        lines: { show: false },
        points: { show: true }
    }
},out)
},1000);
*/
