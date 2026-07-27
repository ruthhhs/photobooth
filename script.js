// variables
const video = document.getElementById('video');
const control = document.getElementById('control');
const countdown = document.getElementById('countdown');
const captureBtn = document.getElementById('capture-btn');
const photoContainer = document.getElementById('photo-container');
const photoList = document.getElementById('photo-list');
const photoFrame = document.querySelectorAll('photo-frame');
const photos = document.querySelectorAll('.photo');
const comment = document.getElementById('comment');
const pages = document.getElementById('pages');
const backBtn = document.getElementById('back-btn');
const downloadBtn = document.getElementById('download-btn');

let resetColor = "#f6f7f2";
let currentPage = 0;

startCamera();
let photosPerSession = 0; // increment to 3

captureBtn.addEventListener("click", () => {
    if (photosPerSession < 3) {
        let timer = 1;
        countdown.textContent = timer;
        const interval = setInterval( () => {
            timer--;
            countdown.textContent = timer;

            if (timer === 0){
                clearInterval(interval);
                createPhoto();
                photosPerSession++;

                if (photosPerSession === 3) { sessionEnd(); }
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

const frameNone = document.getElementById('frame-none');
frameNone.onclick = () => frameClear();

const frame01 = document.getElementById('frame01');
const frame02 = document.getElementById('frame02');
const frame03 = document.getElementById('frame03');
frame01.onclick = () => frameTemplate('./assets/fr01.png');
frame02.onclick = () => frameTemplate('./assets/fr02.png');
frame03.onclick = () => frameTemplate('./assets/fr03.png');

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

    context.scale(-1, 1); // mirror
    context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    photos[photosPerSession].src = canvas.toDataURL();
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

    control.appendChild(btn2);
    control.appendChild(btn1);

    comment.textContent=' Would you like to costumize?';
}
function goToPage(page){
    currentPage = page;
    pages.style.transform = `translateY(-${currentPage * pages.clientHeight}px)`;
}
function resetSession() {
    photosPerSession = 0;
    captureBtn.style.display = "block";
    countdown.style.display = "block";

    document.getElementById("costumizeBtn")?.remove();
    document.getElementById("refreshBtn")?.remove();

    frameClear();
    photos.forEach(photo => {
        photo.src = "./assets/noimg.png";
    });

    comment.textContent='Smile sweetheart <3';
}
function frameClear() {
    document.getElementById("photo-frame")?.remove();

    photoContainer.style.backgroundColor = resetColor;
    photoList.style.backgroundColor = resetColor;
    pickColor.value = resetColor;
}
function frameTemplate(imgsrc) {
    document.getElementById("photo-frame")?.remove();

    const frame = document.createElement("img");
    frame.id = 'photo-frame';
    frame.className = 'photo-frame';
    frame.src = imgsrc;

    photoContainer.appendChild(frame);
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