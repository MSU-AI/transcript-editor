console.log("last line test case");

let transcriptArea = document.getElementById("transcript");
let transcriptHTML = ` `;

function load(){
fetch('/static/assets/output.json')
  .then(response => response.json())
  .then(data => {
    console.log("Data from output.json");
    // console.log(data);
    // Use the data object here
    processData(data);
  });
}

function processData(data) {

    line = '';
    paragraph = `<p>`;
    console.log(data["timestamps"]);
    data = data["timestamps"];

    for (i = 0; i < data.length; i++) {
        // iterates through each line of transcript
        for (j=0; j<data[i]["words"].length; j++) { 
            //iterates through each word of each line of transcript

            words = data[i]["words"][j];
            // `words` represents the data for each word such as text, start and end time 
            word = words["text"];
            
            if (line.length + word.length > 38) {
                // checks if the line is longer than 38 characters and if so it creates a new paragraph (goes to next line)
                console.log(i + " " + line + ", " + word);
                paragraph += `</p>`;
                transcriptHTML += paragraph;
                //ends the paragraph
                
                //new paragraph
                paragraph = '<p>';
                line = word;
                paragraph += `<span data-time=${words['start']}> ${word}</span>`;

            } else {

                line += ` ${word}`;
                paragraph += `<span data-time=${words['start']}> ${word}</span>`;
            }

            if (j == data[i]["words"].length-1 && i == data.length-1){
                // checks if the last word has been reached
                paragraph += `</p>`;
                transcriptHTML += paragraph;
            }

            
        }
    }

    // transcriptHTML += `<p data-time="${words['end']}">${line.trim()}</p>`;
    console.log("*********************** The Transcript HTML ****************************");

    transcriptArea.innerHTML = transcriptHTML;

    console.log(transcriptArea);

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
