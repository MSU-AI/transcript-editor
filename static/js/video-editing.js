let transcriptArea = document.getElementById("transcript");
let transcriptHTML = ` `;

function load(){
fetch('/static/assets/output.json')
  .then(response => response.json())
  .then(data => {
    console.log('Hello world');
    console.log("Data from output.json");
    console.log(data);
    // Use the data object here
    processData(data);
  });
}

function processData(data) {

    line = '';
    paragraph = `<p>`
    console.log(data["timestamps"]);
    data = data["timestamps"];
    for (i = 0; i < data.length; i++) {
        for (j=0; j<data[i]["words"].length; j++) { 
            words = data[i]["words"][j];
            word = words["text"];
            
            if (line.length + word.length > 40) {
                paragraph += `</p>`;
                transcriptHTML += paragraph;
                paragraph = '<p>';
                line = word;
            } else {
                line += `${word}`;
                paragraph += `<span data-time=${words['start']}>${word}</span>`;
            }
        }
    }

    // transcriptHTML += `<p data-time="${words['end']}">${line.trim()}</p>`;

    transcriptArea.innerHTML = transcriptHTML;

    // Add event listeners to the lines
    var words = transcriptArea.getElementsByTagName("span");
    for (var i = 0; i < words.length; i++) {
        var word = words[i];
        var time = word.getAttribute("data-time");

        word.addEventListener("click", (function(time) {
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
