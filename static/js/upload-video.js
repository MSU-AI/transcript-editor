console.log("start of upload.js");


const form = document.querySelector("form"),
    fileInput = document.querySelector(".file-input"),
    progressArea = document.querySelector(".progress-area"),
    uploadedArea = document.querySelector(".uploaded-area");

let video_size;


// form click event
form.addEventListener("click", () =>{
    fileInput.click();
});

fileInput.onchange = async ({target})=>{
    let file = target.files[0]; //getting file [0] this means if user has selected multiple files then get first one only
    if(file){
        video_size = file.size;
        console.log(file);
        console.log(video_size);
        let fileName = file.name; //getting file name
        if(fileName.length >= 12){ //if file name length is greater than 12 then split it and add ...
                let splitName = fileName.split('.');
            fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
        }
        id = await uploadFile(file);

        console.log("FInal ID");
        console.log(id);

        // Now, transcribe the video:

        transcribeFile(id);

        // Just for fun, grab download URL:

        var data = new FormData();
        data.append('id', id);

        var download_url = await makeRequest("/api/get/", data);

        console.log("Download URL:")
        console.log(download_url);
        console.log(download_url["url"]);

        var reader = new FileReader();

        reader.onload = function(e){

            var src = e.target.result;
            var video = document.getElementById("video");
            var source = document.getElementById("source")

            source.setAttribute("src", src);
            video.load();
            generateTimeline();
        } 
        reader.readAsDataURL(file)
    }

}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
        }
    }
    return cookieValue;
}

function doneHandler() {
    console.log("Data from whisper");
    console.log(this.responseText);

    // Send the data along for processing
    processData(JSON.parse(this.responseText))
    // load();
}

async function makeRequest(url, data) {
    // Makes a generic request to the specified URL

    // Make request to backend:

    const promise = fetch(url, {
        method: "POST",
        headers: {
            "X-CSRFToken": getCookie("csrftoken"),
            "Accept": "application/json",
        },
        body: data,
    });

    var final_data = await promise.then(res => res.json());

    return final_data;
}


// file upload function
async function uploadFile(file){

    // Create form data:

    var data = new FormData();
    data.append('video', file);

    var id = await makeRequest('/uploads/', data)

    return id['video-id'];

}


// file transcribe function
function transcribeFile(id) {

    let xhr = new XMLHttpRequest(); //creating new xhr object (AJAX)

    // Add event handler to be called when response is collected:

    xhr.addEventListener("load", doneHandler);

    // Define bar POST request to uploads

    xhr.open("POST", "/api/transcribe/");

    // Set the CSRF Token and set the content type

    xhr.setRequestHeader("X-CSRFToken", getCookie("csrftoken"));
    xhr.setRequestHeader("Accept", "application/json");

    // Build the form data and add the file

    var formData = new FormData();
    formData.append("id", id);

    // Send the data

    xhr.send(formData);

    // Finally, hide the upload screen

    document.getElementById("wrapper").style.display = "none";

    // If the upload feild is gone show the loading bar

    if (document.getElementById("wrapper").style.display == "none") {
        console.log("hidding upload area and starting loading bar")

        let container = document.getElementById("loading-container");
        let fill = document.querySelector(".fill");
        let transcript = document.querySelector(".transcript-container").innerHTML;
        console.log(transcript);

        console.log("loading bar should be showing");
        container.style.display = "flex";
        console.log(container.style.display);

        const messages = ['Loading Transcript...', 'Loading Timeline...', 'Loading Workspace...'];
        let currentMessageIndex = 0;
        const pElement = container.querySelector('p');

        function updateMessage() {
            pElement.textContent = messages[currentMessageIndex];
            currentMessageIndex = (currentMessageIndex + 1) % messages.length;
        }

        setInterval(updateMessage, 8000); 

        let interval = video_size / 100000;
        fill.style.width = 0;

        var bar = 0;
        var run = setInterval(frames, 2);
        function frames() {
            bar++;
            if (fill.style.width.substring(0, 3) == "100") {
                clearInterval(run);
                container.style.display = "none";
            } else {
                fill.style.width = bar / interval + "%";
            }
        }

    }
}
