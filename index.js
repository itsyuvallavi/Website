const menu = $(".menu");
const menuBtn = $(".menu-btn");

menuBtn.on("click", function() {
    menu.toggleClass("nav-toggle");
});

$(".year").html(new Date().getFullYear());

document.addEventListener('DOMContentLoaded', () => {
    const audio = new Audio();
    let currentTrackIndex = 0;
    const tracks = document.querySelectorAll('#playlist li');
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const songName = document.getElementById('song-name');
    const artistName = document.getElementById('artist-name');
    const currentTimeElem = document.getElementById('current-time');
    const totalTimeElem = document.getElementById('total-time');
    const progressBar = document.getElementById('progress');
    const albumArt = document.getElementById('album-art');
    const playPauseOverlay = document.getElementById('play-pause-btn');
  
    function loadTrack(index) {
      const track = tracks[index];
      audio.src = track.getAttribute('data-src');
      songName.textContent = track.textContent;
      artistName.textContent = track.getAttribute('data-artist');
      audio.load();
      audio.addEventListener('loadedmetadata', () => {
        totalTimeElem.textContent = formatTime(audio.duration);
      });
      tracks.forEach((t, i) => {
        t.classList.toggle('active', i === index);
      });
    }
  
    function updateProgress() {
      const currentTime = audio.currentTime;
      const duration = audio.duration;
      const progressPercent = (currentTime / duration) * 100;
      progressBar.style.width = `${progressPercent}%`;
      currentTimeElem.textContent = formatTime(currentTime);
    }
  
    function formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const secondsLeft = Math.floor(seconds % 60);
      return `${minutes}:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;
    }
  
    function togglePlayPause() {
      if (audio.paused) {
        audio.play();
        playBtn.style.display = 'none';
        pauseBtn.style.display = 'inline-block';
        playPauseOverlay.classList.replace('fa-play', 'fa-pause');
      } else {
        audio.pause();
        playBtn.style.display = 'inline-block';
        pauseBtn.style.display = 'none';
        playPauseOverlay.classList.replace('fa-pause', 'fa-play');
      }
    }
  
    function playNext() {
      currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
      loadTrack(currentTrackIndex);
      audio.play();
      togglePlayPause();
    }
  
    function playPrevious() {
      currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
      loadTrack(currentTrackIndex);
      audio.play();
      togglePlayPause();
    }
  
    loadTrack(currentTrackIndex);
  
    playBtn.addEventListener('click', togglePlayPause);
    pauseBtn.addEventListener('click', togglePlayPause);
    prevBtn.addEventListener('click', playPrevious);
    nextBtn.addEventListener('click', playNext);
    playPauseOverlay.addEventListener('click', togglePlayPause);
  
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', playNext);
  
    tracks.forEach((track, index) => {
      track.addEventListener('click', () => {
        currentTrackIndex = index;
        loadTrack(currentTrackIndex);
        audio.play();
        togglePlayPause();
      });
    });
  
    shuffleBtn.addEventListener('click', () => {
      shuffleBtn.classList.toggle('active');
      // Implement shuffle functionality here
    });
  
    // Add click event to progress bar for seeking
    document.querySelector('.progress-bar').addEventListener('click', function(e) {
      const progressBarRect = this.getBoundingClientRect();
      const clickPosition = e.clientX - progressBarRect.left;
      const clickPercentage = clickPosition / progressBarRect.width;
      audio.currentTime = clickPercentage * audio.duration;
      updateProgress();
    });
  });