const menu = $(".menu");
const menuBtn = $(".menu-btn");

menuBtn.on("click", function() {
    menu.toggleClass("nav-toggle");
});

$(".year").html(new Date().getFullYear());

document.addEventListener('DOMContentLoaded', () => {
  const albumGallery = document.querySelector('.album-gallery');
  const playerBar = document.getElementById('playerBar');
  const audio = new Audio();
  let currentTrackIndex = 0;
  let tracks = [];

  // Fetch the JSON data
  fetch('music.json')
      .then(response => response.json())
      .then(data => {
          // Create album gallery
          data.forEach((album, index) => {
              const albumDiv = document.createElement('div');
              albumDiv.classList.add('post', 'album');
              albumDiv.setAttribute('data-aos', 'fade-up'); // Add AOS attribute
              albumDiv.innerHTML = `
                  <img src="${album.image}" alt="${album.album}">
                  <div class="album-info">
                      <h3>${album.album}</h3>
                      <p>${album.style}</p>
                  </div>
              `;
              albumDiv.addEventListener('click', () => {
                  loadPlaylist(album.tracks);
              });
              albumGallery.appendChild(albumDiv);
          });
      });

  // Function to load the playlist
  function loadPlaylist(tracksData) {
      tracks = tracksData;
      updateSongCounter(); // Update song counter
      loadTrack(0); // Load the first track by default
      playerBar.classList.remove('hidden');
  }

  // Function to load a track
  function loadTrack(index) {
      currentTrackIndex = index;
      const track = tracks[index];
      audio.src = track.url;
      document.getElementById('current-song-name').textContent = track.title;
      audio.load();
      audio.addEventListener('loadedmetadata', () => {
          document.getElementById('total-time').textContent = formatTime(audio.duration);
      });
      audio.play(); // Start playing the track after it is loaded
      updateSongCounter(); // Update song counter
  }

  // Function to update the song counter
  function updateSongCounter() {
      const songCounter = document.getElementById('song-counter');
      songCounter.textContent = `${currentTrackIndex + 1} / ${tracks.length}`;
  }

  // Function to format time in mm:ss
  function formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const secondsLeft = Math.floor(seconds % 60);
      return `${minutes}:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;
  }

  // Update progress bar and time
  audio.addEventListener('timeupdate', () => {
      const progress = (audio.currentTime / audio.duration) * 100;
      document.getElementById('progress').style.width = `${progress}%`;
      document.getElementById('current-time').textContent = formatTime(audio.currentTime);
  });

  // Make the progress bar responsive to clicks
  document.getElementById('progress-bar').addEventListener('click', (e) => {
      const progressBar = document.getElementById('progress-bar');
      const newTime = (e.offsetX / progressBar.offsetWidth) * audio.duration;
      audio.currentTime = newTime;
  });

  // Play/Pause functionality
  document.getElementById('play-btn').addEventListener('click', () => {
      audio.play();
      document.getElementById('play-btn').style.display = 'none';
      document.getElementById('pause-btn').style.display = 'inline-block';
  });

  document.getElementById('pause-btn').addEventListener('click', () => {
      audio.pause();
      document.getElementById('play-btn').style.display = 'inline-block';
      document.getElementById('pause-btn').style.display = 'none';
  });

  // Stop functionality
  document.getElementById('stop-btn').addEventListener('click', () => {
      audio.pause();
      audio.currentTime = 0;
      document.getElementById('play-btn').style.display = 'inline-block';
      document.getElementById('pause-btn').style.display = 'none';
  });

  // Close player bar functionality
  document.getElementById('close-btn').addEventListener('click', () => {
      audio.pause();
      playerBar.classList.add('hidden');
      document.getElementById('play-btn').style.display = 'inline-block';
      document.getElementById('pause-btn').style.display = 'none';
  });

  // Next/Previous track functionality
  document.getElementById('next-btn').addEventListener('click', () => {
      currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
      loadTrack(currentTrackIndex);
      audio.play();
  });

  document.getElementById('prev-btn').addEventListener('click', () => {
      currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
      loadTrack(currentTrackIndex);
      audio.play();
  });
});