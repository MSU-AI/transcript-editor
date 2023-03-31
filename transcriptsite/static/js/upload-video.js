console.log("start of upload.js");


const form = document.querySelector("form"),
fileInput = document.querySelector(".file-input"),
progressArea = document.querySelector(".progress-area"),
uploadedArea = document.querySelector(".uploaded-area");


// form click event
form.addEventListener("click", () =>{
  fileInput.click();
});

fileInput.onchange = ({target})=>{
  let file = target.files[0]; //getting file [0] this means if user has selected multiple files then get first one only
  if(file){
    console.log(file);
    let fileName = file.name; //getting file name
    if(fileName.length >= 12){ //if file name length is greater than 12 then split it and add ...
      let splitName = fileName.split('.');
      fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
    }
    uploadFile(file);
    
    var reader = new FileReader();

    reader.onload = function(e){
      var src = e.target.result;
      var video = document.getElementById("video");
      var source = document.getElementById("source")

      source.setAttribute("src", src);
      video.load();
      // Calls the function that generates the timeline for the video  
      generateTimeline(src);  
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


// file upload function
function uploadFile(file){
  let xhr = new XMLHttpRequest(); //creating new xhr object (AJAX)

  // Add event handler to be called when response is collected:

  xhr.addEventListener("load", doneHandler);

  // Define bar POST request to uploads

  xhr.open("POST", "/uploads/");

  // Set the CSRF Token and set the content type

  xhr.setRequestHeader("X-CSRFToken", getCookie("csrftoken"));
  xhr.setRequestHeader("Accept", "application/json");

  // Build the form data and add the file

  var formData = new FormData();
  formData.append("file", file);

  // Send the data

  xhr.send(formData);

  // Finally, hide the upload screen

  document.getElementById("wrapper").style.display = "none";

  // If the upload feild is gone show the loading bar

  if(document.getElementById("wrapper").style.display == "none"){

    let container = document.getElementById("loading-container");
    let fill = document.querySelector(".fill");
    let transcript = document.querySelector(".transcript-container").innerHTML;
    console.log(transcript);

    container.style.display = "block";
    const video = document.getElementById('video');
    let video_len;

    // Check if video has been loaded and grab the length of the video

    video.addEventListener('loadedmetadata', () => {
      video_len = video.duration;
      console.log(video_len);
    });

    // Loop through the video length

    var bar = 0;
    var run = setInterval(frames,2);
    function frames(){
      bar++;
      if (fill.style.width.substring(0,3) == "100"){
          clearInterval(run);
          container.style.display = "none";
      }else{
          fill.style.width = bar/video_len + "%";
      }

      if (document.querySelector(".transcript-container").innerHTML != transcript){
        fill.style.width = "100%";
      }
  }

  } 
  

}


