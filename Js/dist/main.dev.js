"use strict";

var openPlaylist = document.querySelector('.item3');
var backMusicPlayer = document.querySelector('.back');
var playSong = document.querySelector('.play');
var track = document.querySelector('audio');
var like = document.querySelector('.item1');
var mute = document.querySelector('.item2');
var audioProgress = document.querySelector('.progress');
var audioForward = document.querySelector('.icon3');
var audioBackward = document.querySelector('.icon1');
var tracks = document.querySelectorAll('.music-player-footer--list li');
var remove = document.querySelectorAll('.trash');
var poster = document.querySelector('.mainPoster img');
var prog = document.querySelector('.progressbar');
var progressBar = document.querySelector('.progressbar .prog');
var playlist = document.querySelectorAll('.playlist li .poster');
var file = document.querySelector('#mFile'); //Add Event Listeners

file.addEventListener('change', song);
openPlaylist.addEventListener('click', function () {
  document.querySelector('.playlist').style.right = "0";
});
backMusicPlayer.addEventListener('click', function () {
  document.querySelector('.playlist').style.right = "-100%";
});
like.addEventListener('click', function () {
  like.childNodes[1].classList.toggle('fav');
  saveFavorite();
});
playSong.addEventListener('click', playingSong);
mute.addEventListener('click', muted);
audioForward.addEventListener('click', nextSong);
audioBackward.addEventListener('click', prevSong);
tracks.forEach(function (item) {
  item.addEventListener('click', function (ev) {
    item.classList.add('active');
    changeTrack(item);
    playingSong();
    animation();
  });
});
remove.forEach(function (item) {
  item.addEventListener('click', function () {
    item.parentNode.parentNode.remove();
  });
});
track.addEventListener('ended', function () {
  audioProgress.style.strokeDashoffset = 880;
  poster.style.animation = 'none';
  progressBar.style.width = '0px';
  playSong.innerHTML = '<i class="fas fa-play"></i>';
});
track.addEventListener('timeupdate', progress);
prog.addEventListener('click', seekAudio);
playlist.forEach(function (item) {
  item.addEventListener('click', function () {
    chooseSong(item);
    playingSong();
    animation();
  });
}); //Functions

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
  }

  ;
}

function playingSong() {
  var min = (track.duration / 60).toFixed();
  var sec = (track.duration % 60).toFixed();

  if (track.paused) {
    if (sec < 10) {
      document.querySelector('.time').innerHTML = "".concat(min, " : 0").concat(sec);
    } else if (min < 10) {
      document.querySelector('.time').innerHTML = "0".concat(min, " : ").concat(sec);
    } else if (min == 'NaN') {
      document.querySelector('.time').innerHTML = '';
    } else {
      document.querySelector('.time').innerHTML = "".concat(min, " : ").concat(sec);
    }

    ;
    track.play();
    playSong.innerHTML = '<i class="fas fa-pause"></i>';
    animation();
  } else {
    track.pause();
    playSong.innerHTML = '<i class="fas fa-play"></i>';
    animation();
  }

  ;
}

function changeTrack(item) {
  var contentPoster = document.querySelector('.music-player-main--title div');
  var posterSrc = item.childNodes[1].src.split('/');
  var posterTitle = posterSrc[posterSrc.length - 1].split('-');
  var pTitle = posterTitle.map(function (i) {
    return i.replace(/%20/g, ' ');
  });
  track.src = 'Musics' + '/' + pTitle[0] + '-' + pTitle[1].slice(0, -4) + '.mp3';
  playingSong();
  contentPoster.childNodes[1].innerHTML = pTitle[0];
  contentPoster.childNodes[3].innerHTML = pTitle[1].slice(0, -4);
  poster.src = "".concat(posterSrc[posterSrc.length - 2] + '/' + posterSrc[posterSrc.length - 1]);
  playSong.innerHTML = '<i class="fas fa-pause"></i>';
  like.childNodes[1].classList.remove('fav');
  favoritesGet(item);
}

function seekAudio(ev) {
  var clickX = ev.offsetX;
  var duration = track.duration;
  track.currentTime = clickX / 480 * duration;
}

function progress() {
  var currentTime = track.currentTime,
      duration = track.duration;
  var progressValue = currentTime / duration * 875;
  audioProgress.style.strokeDashoffset = 875 - progressValue;
  progressBar.style.width = "".concat(currentTime / duration * 100, "%");
}

function nextSong() {
  var active = document.querySelector('.active');
  var next = active.nextElementSibling;

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
  }

  ;
}

function prevSong() {
  var active = document.querySelector('.active');
  var prev = active.previousElementSibling;

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
  }

  ;
}

function chooseSong(item) {
  var song = item;
  changeTrack(song);
  document.querySelector('.playlist').style.right = "-100%";
}

function song() {
  var files = file.files[0].name;
  console.log(file.files);
  var li = document.createElement('li');
  var ul = document.querySelector('.playlist ul');
  var contentPoster = document.querySelector('.music-player-main--title div');
  var content = files.split('-');
  var rSpace = content.map(function (i) {
    return i.replace(/%20/g, ' ');
  });
  li.innerHTML = "<div class=\"poster circle\">\n    <img src=\"Images/music-player.jpg\" alt=\"\">\n</div>\n<div class=\"music-content\">\n    <h3>".concat(rSpace[0], "</h3>\n    <p>").concat(rSpace[1].slice(0, -4), "</p>\n</div>\n<div class=\"mode flex\">\n    <span class=\"trash\"><i class=\"fa-solid fa-trash\"></i></span>\n</div>");
  li.classList.add('flex');
  ul.insertBefore(li, ul.childNodes[0]);
  li.childNodes[0].addEventListener('click', function () {
    track.src = 'Musics' + '/' + rSpace[0] + '-' + rSpace[1].slice(0, -4) + '.mp3';
    contentPoster.childNodes[1].innerHTML = rSpace[0];
    contentPoster.childNodes[3].innerHTML = rSpace[1].slice(0, -4);
    poster.src = 'Images/music-player.jpg';
    document.querySelector('.playlist').style.right = "-100%";
    playingSong();
    track.pause();
    animation();
  });
}

function saveFavorite() {
  var favList = localStorage.favorites ? JSON.parse(localStorage.favorites) : [];
  var favorites = poster.src;
  favList.push(favorites);
  localStorage.favorites = JSON.stringify(favList);
}

function favoritesGet(item) {
  var favList = localStorage.favorites ? JSON.parse(localStorage.favorites) : [];
  favList.forEach(function (i) {
    if (i === item.childNodes[1].src) like.childNodes[1].classList.add('fav');
  });
}