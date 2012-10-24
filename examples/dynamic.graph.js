function graphing() {
// PoC for dynamic reloading graphs :)
history = []
n = Timer.run(out,function(out) { 
    load("http://poc.hoeja.de/skanti/get.php"); // loads one datapoint at a time (random for now)
    history.push(_); // generates some kind of history
    if(history.length > 101) { history.splice(0,1) } // keeps track that length <= 100
    // generate nice points for flot
    d1 = []; 
    for(i in history) {
        d1.push([i,history[i]])
    }
    // plot that bitch :)
    plot([d1],{
        xaxis:{
            min:0,
            max:100
        },
        yaxis:{
            min:0,
            max:100
        }
    },out);
},100) // let's try it out...
}
