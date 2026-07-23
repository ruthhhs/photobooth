// variables
const video = document.getElementById('video');
const control = document.getElementById('control');
const countdown = document.getElementById('countdown');
const captureBtn = document.getElementById('capture-btn');
const photoContainer = document.getElementById('photo-container');
const photoList = document.getElementById('photo-list');
const comment = document.getElementById('comment');
const pages = document.getElementById('pages');
const backBtn = document.getElementById('back-btn');
const downloadBtn = document.getElementById('download-btn');

const resetColor = "rgb(246, 247, 242)";
let currentPage = 0;

startCamera();
let photosPerSession = 3;

captureBtn.addEventListener("click", () => {
    if (photosPerSession > 0) {
        let timer = 3;
        countdown.textContent = timer;
        const interval = setInterval( () => {
            timer--;
            countdown.textContent = timer;

            if (timer === 0){
                clearInterval(interval);
                createPhoto();
                photosPerSession--;
                if (photosPerSession === 0) { sessionEnd(); }
            }
        }, 1000);   // notes: setInterval( func(), 1000 ) --> 1000ms == 1s
    }
});

backBtn.onclick = () => goToPage(currentPage - 1);
downloadBtn.onclick = () => downloadPhoto();

pickColor.addEventListener("input", (e) => {
    let color = e.target.value;
    photoContainer.style.backgroundColor = color;
    photoList.style.backgroundColor = color;
});

// ===== FUNCTIONS =====

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
function createPhoto(){
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
}
function sessionEnd(){
    captureBtn.style.display = "none";
    countdown.style.display = "none";
    
    const btn1 = document.createElement('button');
    btn1.id = 'costumizeBtn';
    btn1.className = 'btn';
    btn1.innerText = 'Yes abseloutly!';
    btn1.onclick = () => goToPage(currentPage + 1);
    
    const btn2 = document.createElement('button');
    btn2.id = 'refreshBtn';
    btn2.className = 'btn';
    btn2.innerText = "No, I'll retake";
    btn2.onclick = () => resetSession();

    control.appendChild(btn1);
    control.appendChild(btn2);

    comment.textContent='Great! Would you like to costumize?';
}
function goToPage(page){
    currentPage = page;
    pages.style.transform = `translateY(-${currentPage * pages.clientHeight}px)`;
}
function resetSession() {
    photosPerSession = 3;
    captureBtn.style.display = "block";

    document.getElementById("costumizeBtn")?.remove();
    document.getElementById("refreshBtn")?.remove();
    document.getElementById("pickColor")?.remove();
    document.getElementById("photo-list").innerHTML = "";

    comment.textContent='Smile sweetheart <3';

    photoContainer.style.backgroundColor = resetColor;
    photoList.style.backgroundColor = resetColor;
    colorPicker.value = resetColor;
}
function downloadPhoto() {
    html2canvas(document.getElementById("photo-container"))
    .then(canvas => {
        const a = document.createElement("a");
        a.download = "photo.png";
        a.href = canvas.toDataURL("image/png");
        a.click();
    });
}