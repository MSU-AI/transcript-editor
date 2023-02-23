let transcriptArea = document.getElementById("transcript");
let transcriptHTML = ` `

fetch('assets/output.json')
  .then(response => response.json())
  .then(data => {
    // Use the data object here
    console.log(data);
  });

for (let i =0; i<10; i++){
    transcriptHTML += `<p data-time="`+i*5+`">Testing for the length of the transcript container. </p>`
}
// console.log(transcriptHTML);
transcriptArea.innerHTML = transcriptHTML;
// console.log(transcriptArea.innerHtml);


// This script deals with adding functionality to the transcript, and all other features on the site
var transcript = document.getElementById("transcript");
console.log(transcript);
var lines = transcript.getElementsByTagName("p");
console.log(lines);

for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var time = line.getAttribute("data-time");
    console.log(time);

    // Add a click event listener to the line
    line.addEventListener("click", (function(time) {
        return function() {
            var video = document.getElementById("video");

            // Set the video's current time to the time attribute
            video.currentTime = time;
            video.play();
        }
    })(time));
}

    
document.getElementById("play-button").addEventListener("click", function() {
// Code to play the video goes here
});

document.getElementById("pause-button").addEventListener("click", function() {
// Code to pause the video goes here
});

document.getElementById("stop-button").addEventListener("click", function() {
// Code to stop the video goes here
});