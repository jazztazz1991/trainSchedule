var initialName = []; 
var initialDestination = [];
var initialStartTime = [];
var initialFrequency = [];
    
var trainName = initialName; 
var destination = initialDestination;
var startTime = initialStartTime;
var frequency = initialFrequency;
        
var database = firebase.database();

var holdTime;
    
database.ref().on("value", function(snapshot){
    $("#tableBody").empty();
        
    if (snapshot.child("name").exists() && snapshot.child("destination").exists() && snapshot.child("startTime").exists() && snapshot.child("frequency").exists()) {

        trainName = snapshot.val().name;
        destination = snapshot.val().destination;
        startTime = snapshot.val().startTime;
        frequency = snapshot.val().frequency;
        
        var nextTrain = "0";
            
        for(var i = 0; i < trainName.length; i++)
            {
                holdTime = moment(startTime[i], "HH:mm");
                var holdTime2 = moment("03:00","HH:mm");
                var duration = 0;
                duration = holdTime.diff(moment(),'minutes');
                var durationPositive = Math.abs(duration);
                var minTill = frequency[i] - (durationPositive % frequency[i]);
                var nextArrival = moment().add(minTill, "minutes").format("HH:mm");
                
                $("#tableBody").append("<tr><td>" + snapshot.val().name[i] + "</td><td>" + snapshot.val().destination[i] + "</td><td>" + snapshot.val().frequency[i] + "</td><td>" + nextArrival + "</td><td>" + minTill + "</td> </tr>");
            }
    }else{
        $("#tableBody").append("<tr><td>There</td><td>are</td><td>no</td><td>trains</td><td>currently</td> </tr>");
    }
});
//onClick of add train form
$("#submit").on("click",function(event){
    //prevent page reload
    event.preventDefault();
    //set variables to the values of the user input
    trainName.push($("#name").val().trim());
    destination.push($("#destination").val().trim());
    startTime.push($("#startTime").val().trim());
    frequency.push($("#frequency").val().trim());
    
    database.ref().set({
        name: trainName,
        destination: destination,
        startTime: startTime,
        frequency: frequency
    })
});
