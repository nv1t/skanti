Timer = {
    runningTimer:[],
    options:[],
    run: function(_out,callback,time) {
        n = Timer.runningTimer.length;
        Timer.options[n] = [_out,callback,time];
        var update = function () {
            callback(_out)
                Timer.runningTimer[n] = setTimeout(function() {update(); },time);
        }
        update()
        return n;
    },
    stop: function(n) { 
	if(!n) n = Timer.runningTimer.length-1;
	clearTimeout(Timer.runningTimer[n]); 
	Timer.runningTimer.splice(n,1);
	Timer.options.splice(n,1);
	}
}
