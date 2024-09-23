var func_timeSince = function(start){
    var startDate = new Date(start);
    var endDate = new Date();
    var diff = endDate.getTime() - startDate.getTime();
    var minutes = Math.floor(diff / 1000 / 60 );
    
    return  minutes;
}