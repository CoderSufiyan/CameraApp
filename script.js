let video = document.querySelector('video');
let recorder;
let recordBtnCont = document.querySelector('.record-btn-cont')
let recordBtn = document.querySelector('.record-btn')
let captureBtnCont = document.querySelector('.capture-btn-cont')
let captureBtn = document.querySelector('.capture-btn')
let recordFlag = false;
let chunks = []; // for media data in chunks 


let constraints = {
    video: true,
    audio: true
}
// navigator - global browser info 

navigator.mediaDevices.getUserMedia(constraints)
.then((stream)=>{
    video.srcObject = stream;
    recorder = new MediaRecorder(stream);
    // when recorder starts
    recorder.addEventListener('start', (e)=>{
        chunks = [];
    })
    recorder.addEventListener('dataavailable', (e)=>{
        chunks.push(e.data);
    })
    // when recorder stops
    recorder.addEventListener('stop', (e)=>{
        // conversion of media chunks data to video
        // We can represent file type in blob
        let blob = new Blob(chunks, {type: 'video/mp4'});
        let videoURL = URL.createObjectURL(blob);

        // for downloading
        let a = document.createElement('a');
        a.href = videoURL;
        a.download = 'video.mp4';
        a.click();
    })
})

recordBtnCont.addEventListener('click', (e)=>{
    if(!recorder) return;

    recordFlag = !recordFlag;

    if(recordFlag){ // start
        recorder.start();
        recordBtn.classList.add('scale-record');
        startTimer();
    }else{ // stop
        recorder.stop();
        recordBtn.classList.remove ('scale-record');
        stopTimer();
    }
})

let timerID;
let counter = 0; // it represents total seconds
let timer = document.querySelector('.timer');
function startTimer(){
    timer.style.display = 'block';
    function displayTimer(){
        let totalSeconds = counter;
        let hours = Number.parseInt(totalSeconds/3600);
        totalSeconds = totalSeconds % 3600;// remaining seconds
        let minutes = Number.parseInt(totalSeconds/60);
        totalSeconds = totalSeconds%60;
        let seconds = totalSeconds;
        
        hours = (hours < 10) ? `0${hours}` : hours;
        minutes = (minutes < 10) ? `0${minutes}` : minutes;
        seconds = (seconds < 10) ? `0${seconds}` : seconds;

        // inserting values into timer
        timer.innerText = `${hours}:${minutes}:${seconds}`;

        counter++;
    }
    // to call displayTimer function every second
    timerID =  setInterval(displayTimer, 1000);
}
function stopTimer(){
    clearInterval(timerID);
    timer.innerText = "00:00:00";
    timer.style.display = 'none';
}