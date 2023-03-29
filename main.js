const container = document.querySelector(".container"),
mainVideo = container.querySelector("video"),
playPauseBtn = container.querySelector(".play-pause i"),
progressBar= container.querySelector(".progress-bar"),
skipBackward = container.querySelector(".skip-backward i"),
skipForward = container.querySelector(".skip-forward i"),
volumeBtn = container.querySelector(".volume i"),
volumeSlider =container.querySelector(".left input"),
speedBtn = container.querySelector(".playback-speed span"),
speedOptions = container.querySelector(".speed-options"),
picInPicBtn = container.querySelector(".pic-in-pic span"),
fullScreenBtn = container.querySelector(".fullscreen i"),
videoTimeLine =container.querySelector(".video-timeline"),
currentVidTime = container.querySelector(".current-time"),
videoDuration = container.querySelector(".video-duration");
let timer; 


const hideControls = () => { // Video duraklatılmışsa (paused = true), fonksiyonu sonlandır. Yoksa, "setTimeout"  "container" öğesinden "show-controls" sınıfını 3 saniye sonra kaldırır.
    if(mainVideo.paused) return ; 
   timer =  setTimeout(() => {
        container.classList.remove("show-controls")
    },3000);
}
hideControls();

container.addEventListener("usemove", () => { // denetimleri görünür hale getir, sonra "clearTimeout" ile önceki zamanlayıcıyı iptal et ve "hideControls" fonksiyonunu tekrar çağır, 3s sonra denetimleri tekrar gizle
    container.classList.add("show-controls");
    clearTimeout(timer);
    hideControls()
})



const formatTime = time =>{
    let seconds =Math.floor(time % 60),
    minutes = Math.floor (time /60) % 60,
    hours = Math.floor(time / 3600 );

    seconds = seconds < 10 ? `0${seconds}`  : seconds;
    minutes = minutes < 10 ? `0${minutes}`  : minutes;
    hours  = hours <10 ? `0${hours}`  : hours;

    if(hours == 0 ){
   return `${minutes}: ${seconds}`;
    }
    return `${hours} : ${minutes} : ${seconds}`;
}




mainVideo.addEventListener("timeupdate", e => {  // videonun oynatma süresi değiştiğinde güncellemede bu fonk. kullanılır.
    let {currentTime, duration } = e.target ;
    let percent =(currentTime / duration) *100 //yüzde al
   progressBar.style.width = `${percent}%`;
   currentVidTime.innerText = formatTime(currentTime) // formatTime dk:sn cinsine çevirir
});

mainVideo.addEventListener("loadeddata", e => { //loadeddata video yüklenmesini tamamlandığını gösterir
videoDuration.innerText = formatTime(e.target.duration) //  videonun durduğunda süresini yazdırır
});


videoTimeLine.addEventListener("click", e =>{
    let timelineWidth = videoTimeLine.clientWidth;  // clientWidth yatay uzunuk ölçer. videonun zamanının nerde olduğunu getirir
   mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration // videonun şimdiki zamanının güncellemesi. 

});
// MOuse ilerleme çubuğunun üzerinde sürüklediğinde, "draggableProgressBar" fonksiyonu tetiklenir ve oynatma süresi ilerletilir.
videoTimeLine.addEventListener("mousedown", () => {
    videoTimeLine.addEventListener("mousemove", draggableProgressBar);
});
// mouse tuşunun serbest bırakılması ile mousemove kaldır
container.addEventListener("mouseup", () => {
    videoTimeLine.removeEventListener("mousemove", draggableProgressBar);
});
// ilerleme çubuğunda fare imleci hareket ettikçe oynatma süresini güncellenme
videoTimeLine.addEventListener("mousemove", e =>{  //fare hareket ettikçe tetiklenir
    const progressTime = videoTimeLine.querySelector("span");
    let offsetX = e.offsetX;  //offsetX, imlecin ilerleme çubuğunun sol kenarından itibaren hareket ettiği noktadaki yatay mesafe
    progressTime.style.left= `${offsetX} px`;
    let timelineWidth = videoTimeLine.clientWidth;
    let percent = (e.offsetX / timelineWidth)*mainVideo.duration;
    progressTime.innerText = formatTime(percent);
})


const draggableProgressBar = e =>{
    let timelineWidth = videoTimeLine.clientWidth;  // clientWidth yatay uzunuk ölçer. videonun zamanının nerde olduğunu getirir
    progressBar.style.width= `${e.offsetX}px`
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration // videonun şimdiki zamanının güncellemesi. 
    currentVidTime.innerText = formatTime(mainVideo.currentTime);
}


//Tıklama işlemi gerçekleştiğinde, eğer ses kontrol düğmesi "bi-volume-up-fill" sınıfını içermiyorsa, ses seviyesini 0,5 olarak ayarlar ve "bi-volume-mute-fill" sınıfını "bi-volume-up-fill" sınıfı ile değiştirir. 
  volumeBtn.addEventListener("click", () => { 
    if(!volumeBtn.classList.contains(" bi-volume-up-fill")){
        mainVideo.volume= 0.5; //video hacmi olarak 0,5 değerini geçer yani %50 geçer 
        volumeBtn.classList.replace("bi-volume-mute-fill","bi-volume-up-fill")
    }else{
     mainVideo.volume = 0.0;
     volumeBtn.classList.replace("bi-volume-up-fill","bi-volume-mute-fill")
    }
    volumeSlider.value= mainVideo.volume // kaydırıcı ses video sesi olarak güncellenir
});



volumeSlider.addEventListener("input", e =>{
    mainVideo.volume = e.target.value; //kaydırıcı değerini video sesi olarak geçirme
if(e.target.value == 0 ){// eğer ses 0 ise ikon  mute olarak değiştirilir
    volumeBtn.classList.replace("bi-volume-up-fill", "bi-volume-mute-fill");
}else{
    volumeBtn.classList.replace("bi-volume-mute-fill","bi-volume-up-fill"); 
}
});


// hız butonunu açma kapatma
speedBtn.addEventListener("click", ()=> {
    speedOptions.classList.toggle("show");
});



speedOptions.querySelectorAll("li").forEach(option => {
    option.addEventListener("click", () => {
        mainVideo.playbackRate = option.dataset.speed; //dataset video oynatma değeri olarak geçirme, playbackRate hızlandırma yavaşlandırmak için kullanılır
        speedOptions.querySelector(".active").classList.remove("active");// active classını kaldır
        option.classList.add("active"); // seçilen option'a ekle 
    })
});



//documente click ile  hız seçeneklerini gizle

document.addEventListener("click", e =>{
    if(e.target.tagName !== "SPAN" || e.target.className !== "material-symbols-rounded"){
        speedOptions.classList.remove("show");
    }
});

picInPicBtn.addEventListener("click", () => {
    mainVideo.requestPictureInPicture(); // videoyu bağımsız oynatma küçük ekranda farklı noktalarda oynatma, büyültme küçültme işlemi

});

fullScreenBtn.addEventListener("click", ()=>{
    container.classList.toggle("fullscreen");
    if(document.fullscreenElement){ // eğer video herzaman fullsceen modda ise
fullScreenBtn.classList.replace("bi-fullscreen-exit", "bi-fullscreen");
return document.exitFullscreen(); // full screen moddan çık ve çağırıldığın yere dön
    }
    fullScreenBtn.classList.replace ("bi-fullscreen", "bi-fullscreen-exit");
    container.requestFullscreen(); // fullscreen moduna git
})


skipBackward.addEventListener("click", () => {
    mainVideo.currentTime -= 6 ;  //geçerli video süresinden 5 saniye çıkar
});

skipForward.addEventListener("click", () => {
    mainVideo.currentTime += 6 ;  //geçerli video süresine 5 saniye ekle
});



// eğer video play ise pause yap, pause ise play yap
playPauseBtn.addEventListener("click", () => {
    mainVideo.paused ? mainVideo.play() : mainVideo.pause();
});
// play tuşu ile pause tuşu değiştirmesi 
mainVideo.addEventListener("play", () => {
 playPauseBtn.classList.replace("bi-play","bi-pause" );
});

mainVideo.addEventListener("pause", () => {
    playPauseBtn.classList.replace("bi-pause", "bi-play")
});