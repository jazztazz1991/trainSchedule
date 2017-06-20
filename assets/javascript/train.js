//initial variable declerations
var initialName = []; 
var initialDestination = [];
var initialStartTime = [];
var initialFrequency = [];
    
var trainName = initialName; 
var destination = initialDestination;
var startTime = initialStartTime;
var frequency = initialFrequency;
var database = firebase.database();
var holdTime, duration, durationPositive, minTill, nextArrival;

//function for when the values inside database changes
database.ref().on("value", function(snapshot){
    //empties table
    $("#tableBody").empty();
    
    //check if the child names exist inside the database
    if (snapshot.child("name").exists() && snapshot.child("destination").exists() && snapshot.child("startTime").exists() && snapshot.child("frequency").exists()) {
        // set global variables to the database
        trainName = snapshot.val().name;
        destination = snapshot.val().destination;
        startTime = snapshot.val().startTime;
        frequency = snapshot.val().frequency;
            
        //run a loop for each train
        for(var i = 0; i < trainName.length; i++)
            {
                //find the minutes till and next arrival
                holdTime = moment(startTime[i], "HH:mm");
                duration = holdTime.diff(moment(),'minutes');
                durationPositive = Math.abs(duration);
                minTill = frequency[i] - (durationPositive % frequency[i]);
                nextArrival = moment().add(minTill, "minutes" ).format( "HH:mm" );
                
                //display the train information
                $("#tableBody").append("<tr><td>" + snapshot.val().name[i] + "</td><td>" + snapshot.val().destination[i] + "</td><td>" + snapshot.val().frequency[i] + "</td><td>" + nextArrival + "</td><td>" + minTill + "</td> </tr>");
            }
    }else{
        //if no data exist in the database display this
        $("#tableBody").append("<tr><td>There</td><td>are</td><td>no</td><td>trains</td><td>currently</td> </tr>");
    }
});

//on click of the submit button
$("#submit").on("click",function(event){
    //prevent from reloading
    event.preventDefault();
    //push each value into its respective array
    trainName.push($("#name").val().trim());
    destination.push($("#destination").val().trim());
    startTime.push($("#startTime").val().trim());
    frequency.push($("#frequency").val().trim());
    
    //set the database to the global arrays
    database.ref().set({
        name: trainName,
        destination: destination,
        startTime: startTime,
        frequency: frequency
    })
    
    //empty the input locations
    $("#name").empty();
    $("#destination").empty();
    $("#startTime").empty();
    $("#frequency").empty();
});
