// variables
const video = document.getElementById('video');
const captureBtn = document.getElementById('capture-btn');
const photoList = document.getElementById('photo-list');

// activate camera
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true
        });
        video.srcObject = stream;
    } catch (err) {
        console.error("Cannot access camera :(", err);
    }
}
startCamera();

// capture button logic

let remainingSessions = 3;

captureBtn.addEventListener("click", () => {
    if (remainingSessions > 0) {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    
        // create image
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL("image/png");
    
        // listing images into photo-list
        const img = document.createElement('img');
        img.src = dataURL;
        photoList.appendChild(img);

        remainingSessions--;

        if (remainingSessions === 0) {
            captureBtn.textContent = 'Download here !';
        }

    } else {
        // download fuction
        html2canvas(document.getElementById("photo-container"))
        .then(canvas => {
            const a = document.createElement("a");
            a.download = "photo.png";
            a.href = canvas.toDataURL("image/png");
            a.click();
        });

    }
});