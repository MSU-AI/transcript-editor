let cutButton = document.getElementById("cut");
let startButton = document.getElementById("start"); 
let endButton = document.getElementById("end");
let timelineTimestamps = {"timestamps": []};


// This function generates the timeline
function generateTimeline() {
    const video = document.querySelector('#video');
    const screenshotContainer = document.querySelector('#screenshotContainer');
    const bar = document.querySelector('#bar');
    let interval;
    let isDragging = false;

    video.playbackRate = 16; // play the video at 16x speed
    video.muted = true; // mute the videoWidth
    video.play();

    video.addEventListener('play', () => {
        interval = setInterval(() => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
            const img = document.createElement('img');
            img.src = canvas.toDataURL();
            img.classList.add('screenshot');
            img.addEventListener('click', (e) => {
                updateBarPosition(e.clientX);
            });
            screenshotContainer.appendChild(img);
        }, 10000 / video.playbackRate); // take a screenshot every 10 seconds at normal speed (0.625 seconds at 16x speed)
    });

    video.addEventListener('pause', () => {
        clearInterval(interval);
    });

    video.addEventListener('ended', () => {
        clearInterval(interval);
        video.playbackRate = 1; // reset the playback rate to normal speed
        video.muted = false; // unmute the video
        video.currentTime = 0;
        let fill = document.querySelector(".fill");
        if (document.querySelector(".transcript-container").innerHTML != transcript) {
                fill.style.width = "100%";
            }
    });

    bar.addEventListener('mousedown', (e) => {
        isDragging = true;
        updateBarPosition(e.clientX);
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            updateBarPosition(e.clientX);
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    function updateBarPosition(clientX) {
        const rect = screenshotContainer.getBoundingClientRect();
        const x = clientX - rect.left + screenshotContainer.scrollLeft;
        const position = Math.max(0, Math.min(x / rect.width, 1));
        bar.style.left = `${position * 100}%`;
        video.currentTime = position * video.duration;
    } 

    screenshotContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        screenshotContainer.scrollLeft += e.deltaY;
    }); 
}

function cuttingMode(){
    
    cutButton.style.display = "none";
    startButton.style.display = "flex";
    endButton.style.display = "flex";
}

function startCut(){
    console.log(timelineTimestamps["timestamps"]);
    timelineTimestamps["timestamps"] = [];
    timelineTimestamps["timestamps"].push([video.currentTime]);
}

function endCut(){

    console.log(video.currentTime);

    timelineTimestamps["timestamps"][0].push(video.currentTime);
    cutVideo(id, timelineTimestamps);

    cutButton.style.display = "flex";
    startButton.style.display = "none";
    endButton.style.display = "none";

}
