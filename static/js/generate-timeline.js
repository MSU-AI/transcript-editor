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

