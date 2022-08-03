const openPlaylist = document.querySelector('.item3');
const backMusicPlayer = document.querySelector('.back');
const playSong = document.querySelector('.play');
const track = document.querySelector('audio');
const like = document.querySelector('.item1');
const mute = document.querySelector('.item2');
const audioProgress = document.querySelector('.progress');
const audioForward = document.querySelector('.icon3');
const audioBackward = document.querySelector('.icon1');
const tracks = document.querySelectorAll('.music-player-footer--list li');
const remove = document.querySelectorAll('.trash');
const poster = document.querySelector('.mainPoster img');
const prog = document.querySelector('.progressbar');
const progressBar = document.querySelector('.progressbar .prog');
const playlist = document.querySelectorAll('.playlist li .poster');
const file = document.querySelector('#mFile');




//Add Event Listeners
file.addEventListener('change', song);
openPlaylist.addEventListener('click', () => {
    document.querySelector('.playlist').style.right = "0";
})

backMusicPlayer.addEventListener('click', () => {
    document.querySelector('.playlist').style.right = "-100%";
})
like.addEventListener('click', () => {
    like.childNodes[1].classList.toggle('fav');
    saveFavorite();
});

playSong.addEventListener('click', playingSong);
mute.addEventListener('click', muted);
audioForward.addEventListener('click', nextSong);
audioBackward.addEventListener('click', prevSong);

tracks.forEach(item => {
    item.addEventListener('click', (ev) => {
        item.classList.add('active');
        changeTrack(item);
        playingSong();
        animation();
    });
})

remove.forEach(item => {
    item.addEventListener('click', () => {
        item.parentNode.parentNode.remove();
    });
})

track.addEventListener('ended', () => {
    audioProgress.style.strokeDashoffset = 880;
    poster.style.animation = 'none';
    progressBar.style.width = '0px';
    playSong.innerHTML = '<i class="fas fa-play"></i>';
})

track.addEventListener('timeupdate', progress);
prog.addEventListener('click', seekAudio);
playlist.forEach(item => {
    item.addEventListener('click', () => {
        chooseSong(item);
        playingSong();
        animation();
    });
})



//Functions
function animation() {
    if (track.paused) {
        poster.style.animationPlayState = 'paused';
        audioProgress.style.strokeDashoffset = 880;
    } else {
        poster.style.animationPlayState = 'running';
    }
    poster.style.animationName = 'rotate';
    poster.style.animationDuration = '7s';
    poster.style.animationTimingFunction = 'linear';
    poster.style.animationIterationCount = 'infinite';
}

function muted() {
    if (track.muted) {
        track.muted = false;
        mute.innerHTML = '<i class="fa-solid fa-volume-low"></i>';
    } else {
        track.muted = true;
        mute.innerHTML = '<i class="fas fa-volume-mute"></i>';
    };
}

function playingSong() {
    let min = (track.duration / 60).toFixed();
    let sec = (track.duration % 60).toFixed();
    if (track.paused) {
        if (sec < 10) {
            document.querySelector('.time').innerHTML = `${min} : 0${sec}`;
        } else if (min < 10) {
            document.querySelector('.time').innerHTML = `0${min} : ${sec}`;
        } else if (min == 'NaN') {
            document.querySelector('.time').innerHTML = '';
        } else {
            document.querySelector('.time').innerHTML = `${min} : ${sec}`;
        };
        track.play();
        playSong.innerHTML = '<i class="fas fa-pause"></i>';
        animation();
    } else {
        track.pause();
        playSong.innerHTML = '<i class="fas fa-play"></i>';
        animation();
    };
}

function changeTrack(item) {
    const contentPoster = document.querySelector('.music-player-main--title div');
    const posterSrc = item.childNodes[1].src.split('/');
    const posterTitle = posterSrc[posterSrc.length - 1].split('-');
    const pTitle = posterTitle.map(i => {
        return i.replace(/%20/g, ' ');
    });
    track.src = 'Musics' + '/' + pTitle[0] + '-' + pTitle[1].slice(0, -4) + '.mp3';
    playingSong();
    contentPoster.childNodes[1].innerHTML = pTitle[0];
    contentPoster.childNodes[3].innerHTML = pTitle[1].slice(0, -4);
    poster.src = `${posterSrc[posterSrc.length - 2] + '/' + posterSrc[posterSrc.length - 1]}`;
    playSong.innerHTML = '<i class="fas fa-pause"></i>';
    like.childNodes[1].classList.remove('fav');
    favoritesGet(item);
}

function seekAudio(ev) {
    const clickX = ev.offsetX;
    const { duration } = track;
    track.currentTime = (clickX / 480) * duration;
}

function progress() {
    const { currentTime, duration } = track;
    const progressValue = (currentTime / duration) * 875;
    audioProgress.style.strokeDashoffset = 875 - progressValue;
    progressBar.style.width = `${(currentTime / duration) * 100}%`;
}

function nextSong() {
    const active = document.querySelector('.active');
    const next = active.nextElementSibling;
    if (next) {
        active.classList.remove('active');
        next.classList.add('active');
        changeTrack(next);
        playingSong();
        animation();
    } else {
        active.classList.remove('active');
        tracks[0].classList.add('active');
        changeTrack(tracks[0]);
        playingSong();
        animation();
    };
}

function prevSong() {
    const active = document.querySelector('.active');
    const prev = active.previousElementSibling;
    if (prev) {
        active.classList.remove('active');
        prev.classList.add('active');
        changeTrack(prev);
        playingSong();
        animation();
    } else {
        active.classList.remove('active');
        tracks[tracks.length - 1].classList.add('active');
        changeTrack(tracks[tracks.length - 1]);
        playingSong();
        animation();
    };
}

function chooseSong(item) {
    const song = item;
    changeTrack(song);
    document.querySelector('.playlist').style.right = "-100%";

}

function song() {
    const files = file.files[0].name;
    console.log(file.files);
    const li = document.createElement('li');
    const ul = document.querySelector('.playlist ul');
    const contentPoster = document.querySelector('.music-player-main--title div');
    const content = files.split('-');
    const rSpace = content.map(i => {
        return i.replace(/%20/g, ' ');
    });
    li.innerHTML = `<div class="poster circle">
    <img src="Images/music-player.jpg" alt="">
</div>
<div class="music-content">
    <h3>${rSpace[0]}</h3>
    <p>${rSpace[1].slice(0,-4)}</p>
</div>
<div class="mode flex">
    <span class="trash"><i class="fa-solid fa-trash"></i></span>
</div>`;
    li.classList.add('flex');
    ul.insertBefore(li, ul.childNodes[0]);
    li.childNodes[0].addEventListener('click', () => {
        track.src = 'Musics' + '/' + rSpace[0] + '-' + rSpace[1].slice(0, -4) + '.mp3';
        contentPoster.childNodes[1].innerHTML = rSpace[0];
        contentPoster.childNodes[3].innerHTML = rSpace[1].slice(0, -4);
        poster.src = 'Images/music-player.jpg';
        document.querySelector('.playlist').style.right = "-100%";
        playingSong();
        track.pause();
        animation();
    })
}

function saveFavorite() {
    const favList = localStorage.favorites ? JSON.parse(localStorage.favorites) : [];
    const favorites = poster.src;
    favList.push(favorites);
    localStorage.favorites = JSON.stringify(favList);
}

function favoritesGet(item) {
    const favList = localStorage.favorites ? JSON.parse(localStorage.favorites) : [];
    favList.forEach(i => {
        if (i === item.childNodes[1].src) like.childNodes[1].classList.add('fav');
    });
}