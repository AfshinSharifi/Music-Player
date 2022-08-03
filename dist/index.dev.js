"use strict";

var progress = document.querySelector('svg circle');
var audio = document.querySelector('audio');
var progressBar = document.querySelector('.progressbar .progressbar-co');
var prog = document.querySelector('.progressbar');
audio.addEventListener('timeupdate', function () {
  var duration = audio.duration,
      currentTime = audio.currentTime;
  var progressValue = currentTime / duration * 880;
  progress.style.strokeDashoffset = 880 - progressValue;
  progressBar.style.width = currentTime / duration * 260 + 'px';
});
prog.addEventListener('click', function (ev) {
  var clickX = ev.offsetX;
  var duration = audio.duration;
  audio.currentTime = clickX / 260 * duration;
});