let transcriptArea = document.getElementById("transcript");
let transcriptHTML = ` `;

fetch('assets/output.json')
  .then(response => response.json())
  .then(data => {
    // Use the data object here
    processData(data);
  });

function processData(data) {

    line = '';

    console.log(data["timestamps"]);
    data = data["timestamps"];
    for (i = 0; i < data.length; i++) {
        for (j=0; j<data[i]["words"].length; j++) { 
            words = data[i]["words"][j];
            word = words['word'];
            
            if (line.length + word.length > 40) {
                transcriptHTML += `<p data-time="${words['start']}">${line.trim()}</p>`;
                line = word;
            } else {
                line += `${word}`;
            }
        }
    }

    transcriptHTML += `<p data-time="${words['end']}">${line.trim()}</p>`;

    transcriptArea.innerHTML = transcriptHTML;

    // Add event listeners to the lines
    var lines = transcriptArea.getElementsByTagName("p");
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var time = line.getAttribute("data-time");

        line.addEventListener("click", (function(time) {
            return function() {
                var video = document.getElementById("video");

                // Set the video's current time to the time attribute
                video.currentTime = time;
                video.play();
            }
        })(time));
    }
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