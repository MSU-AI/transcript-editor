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

function deleteTranscript(){
    console.log("del transcript element");
}

function downloadTranscript(){
    console.log("downloading transcript");

    // var link = document.createElement("a");
    // link.download = name;
    // link.href = uri;
    // link.click();
}
