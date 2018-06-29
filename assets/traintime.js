//Steps to complete:
// 1. Initialize Firebase
// 2. Create button for adding new trains - then update the html + update the database
// 3. Create Firebase event for adding train to the database
// 3.1 Store everything into a variable.
// 3.2 Calculate Minutes to arrival and Next train 
// 3.4 Create the new row and append to train-table

// 1. Initialize Firebase
var config = {
  apiKey: "AIzaSyAGgMdUmP1jh8x2p-c6XYoJQgBFETQr0Rk",
  authDomain: "trainschedule2018.firebaseapp.com",
  databaseURL: "https://trainschedule2018.firebaseio.com",
  projectId: "trainschedule2018",
  storageBucket: "trainschedule2018.appspot.com",
  messagingSenderId: "96382608008"
};
firebase.initializeApp(config);

var database = firebase.database();

//show the current time at the top-right corner 
var currentTime = moment().format("HHmm");
var currentTime2 = moment().format("hh:mm A")
console.log(currentTime);
$("#currentTime").append(currentTime + " (" + currentTime2 + ")");

// 2. Button for adding train schedule 
$("#add-train-btn").on("click", function(event) {

  //prevent submission 
  event.preventDefault();

  // Grabs user input
  //try to validate inputs 
  var trainName = $("#train-name-input").val().trim();
  var trainDestination = $("#destination-input").val().trim();
  var trainTime = $("#train-time-input").val().trim();
  var trainFrequency = $("#frequency-input").val().trim();
  
  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    destination: trainDestination,
    time: trainTime,
    frequency: trainFrequency,
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.time);
  console.log(newTrain.frequency);

  // // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#train-time-input").val("");
  $("#frequency-input").val("");
});

// 3. Create Firebase event for adding train to the database and 
//a row in the html when a user adds an entry
database.ref().on("child_added", function(snapshot) {
  console.log(snapshot.val());

  // 3.1 Store everything into a variable.
  var trainName = snapshot.val().name;
  var trainDestination = snapshot.val().destination;
  var trainTime = snapshot.val().time;
  var trainFrequency = snapshot.val().frequency;

  // Check train Info/values
  console.log(trainName);
  console.log(trainDestination);
  console.log(trainTime);
  console.log(trainFrequency);

  //3.2 Calculate Minutes to arrival and Next train 
  //User inputs the initial start time of the train 
  //User inputs the frequency of the train arrival 

  // (TEST 2)
  // First Train of the Day is 3:00 AM
  // Assume Train comes every 7 minutes.
  // Assume the current time is 3:16 AM....
  // What time would the next train be...? (Use your brain first)
  // It would be 3:21 -- 5 minutes away

  // Solved Mathematically
  // Test case 2:
  // 16 - 00 = 16
  // 16 % 7 = 2 (Modulus is the remainder)(Minutes/ frequency = remainder)
  // 7 - 2 = 5 minutes away (frequency - reminder = minutes away)
  // 5 + 3:16 = 3:21 (minutes away + time = next arrival)

  //Solve using Moment js 
  //3.2 Calculate Minutes to arrival and Next train 
  // First Time (pushed back 1 year to make sure it comes before current time)
  var trainTimeConverted = moment(trainTime, "HH:mm").subtract(1, "years");
  console.log(trainTimeConverted);

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(trainTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % trainFrequency;
  console.log(tRemainder);

  // Minute Until Train
  var tMinutesTillTrain = trainFrequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  var nextTrainTime = moment(nextTrain).format("hh:mm A");
  console.log("ARRIVAL TIME: " + nextTrainTime);

  // 3.4 Create the new row and append to train-table
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainDestination),
    $("<td>").text(trainFrequency),
    $("<td>").text(nextTrainTime),
    $("<td>").text(tMinutesTillTrain),
  );

  //3.3 Append the new row to the table
  $("#train-table > tbody").append(newRow);

});