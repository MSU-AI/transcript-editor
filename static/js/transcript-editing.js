// Grab each element by id in order to change the id name.
    
    let transcript_container = document.querySelector(".transcript-container");  
    let transcript = document.getElementById("transcript");
    let edit_button = document.getElementById("edit-transcript");
    let save_button = document.getElementById("save-transcript");
    let delete_button = document.getElementById("delete-transcript");

// This function is called when the user clicks the edit button

function editTranscript(){
    console.log("************ Editing Transcript ***************");
 
    // Hides all unessiary buttons and displays the save and delete buttons

    transcript_container.classList.replace('transcript-container','transcript-container-editing');
    transcript.setAttribute('id', 'transcript-editing');
    edit_button.style.display = "none";
    save_button.style.display = "inline";
    delete_button.style.display = "inline";

}

function saveTranscript(){
    console.log("saving transcript");

    transcript_container.classList.replace('transcript-container-editing','transcript-container');
    transcript.setAttribute('id', 'transcript');
    edit_button.style.display = "inline";
    save_button.style.display = "none";
    delete_button.style.display = "none";



}

const transcript_del = document.getElementById("transcript");

transcript_del.addEventListener("click", function(event) {
        // Check if the clicked element is a word (in this case, a span with data-time attribute)
        if (event.target.tagName === "SPAN" && event.target.hasAttribute("data-time")) {
            // Toggle the 'selected-word' class on the clicked element
            event.target.classList.toggle("selected-word");
        }
});

function deleteTranscript() {
    // Get all the selected words
    let selectedWords = document.querySelectorAll('.selected-word');
    let selectedWordsArr = Array.from(selectedWords);

    // Find the lines that contain the selected words
    let linesToDelete = {};
    selectedWordsArr.forEach(function(word) {
        let line = word.closest('p').textContent;
        linesToDelete[line] = true;
    });

    // Delete the lines that contain the selected words
    let paragraphs = transcriptArea.querySelectorAll('p');
    paragraphs.forEach(function(paragraph) {
        let line = paragraph.textContent;
        if (linesToDelete[line]) {
            paragraph.parentNode.removeChild(paragraph);
        }
    });

    // Update the transcript HTML with the modified HTML
    let transcriptContainer = document.querySelector('.transcript-container');
    let transcriptHTML = transcriptContainer.innerHTML;

    transcriptArea.innerHTML = transcriptHTML;
}

function downloadTranscript(){
    console.log("downloading transcript");

    // var link = document.createElement("a");
    // link.download = name;
    // link.href = uri;
    // link.click();
}
