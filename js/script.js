const wrapper = document.querySelector(".wrapper"),
  musicImg = wrapper.querySelector(".img-area img"),
  musicName = wrapper.querySelector(".song-details .name"),
  musicArtist = wrapper.querySelector(".song-details .artist"),
  playPauseBtn = wrapper.querySelector(".play-pause"),
  prevBtn = wrapper.querySelector("#prev"),
  nextBtn = wrapper.querySelector("#next"),
  mainAudio = wrapper.querySelector("#main-audio"),
  progressArea = wrapper.querySelector(".progress-area"),
  progressBar = progressArea.querySelector(".progress-bar"),
  musicList = wrapper.querySelector(".music-list"),
  moreMusicBtn = wrapper.querySelector("#more-music"),
  closeMoreMusic = musicList.querySelector("#close"),
  repeatBtn = wrapper.querySelector("#repeat-plist"),
  ulTag = wrapper.querySelector("ul");

let musicIndex = Math.floor(Math.random() * allMusic.length);
let isMusicPaused = true;
let currentSong = null;
let currentIndex = 0;
let countdownInterval;

window.addEventListener("load", () => {
  loadMusic(musicIndex);
  updatePlayingSong();
});

// Load music details
function loadMusic(index) {
  const song = allMusic[index];
  musicName.innerText = song.name;
  musicArtist.innerText = song.artist;
  musicImg.src = `images/${song.src}.jpg`;
  mainAudio.src = `songs/${song.src}.mp3`;
}

// Play music
function playMusic() {
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
}

// Pause music
function pauseMusic() {
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}

// Play previous song
function prevMusic() {
  musicIndex = (musicIndex - 1 + allMusic.length) % allMusic.length;
  loadMusic(musicIndex);
  playMusic();
  updatePlayingSong(); // Update list
}

// Play next song
function nextMusic() {
  musicIndex = (musicIndex + 1) % allMusic.length;
  loadMusic(musicIndex);
  playMusic();
  updatePlayingSong(); // Update list
}

// Select a song from the list
function selectSong(element) {
  const selectedIndex = element.getAttribute("li-index");
  musicIndex = selectedIndex - 1;
  loadMusic(musicIndex);
  playMusic();
  updatePlayingSong(); // Update list
}

// Play or pause event
playPauseBtn.addEventListener("click", () => {
  const isPlaying = wrapper.classList.contains("paused");
  isPlaying ? pauseMusic() : playMusic();
  updatePlayingSong();
});

// Previous and next button events
prevBtn.addEventListener("click", prevMusic);
nextBtn.addEventListener("click", nextMusic);

// Update progress bar as music plays
mainAudio.addEventListener("timeupdate", (e) => {
  if (mainAudio.duration) {
    const progressWidth = (e.target.currentTime / mainAudio.duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    updateCurrentTime(e.target.currentTime);
  }
});

// Update current time and duration
function updateCurrentTime(currentTime) {
  const currentMin = Math.floor(currentTime / 60);
  const currentSec = Math.floor(currentTime % 60)
    .toString()
    .padStart(2, "0");
  wrapper.querySelector(".current-time").innerText = `${currentMin}:${currentSec}`;
}

mainAudio.addEventListener("loadeddata", () => {
  const totalMin = Math.floor(mainAudio.duration / 60);
  const totalSec = Math.floor(mainAudio.duration % 60)
    .toString()
    .padStart(2, "0");
  wrapper.querySelector(".max-duration").innerText = `${totalMin}:${totalSec}`;
});

// Seek through the progress bar
progressArea.addEventListener("click", (e) => {
  const progressWidth = progressArea.clientWidth;
  const clickedOffsetX = e.offsetX;
  mainAudio.currentTime = (clickedOffsetX / progressWidth) * mainAudio.duration;
  playMusic();
  updatePlayingSong();
});

// Repeat/shuffle button event
repeatBtn.addEventListener("click", () => {
  switch (repeatBtn.innerText) {
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffled");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist looped");
      break;
  }
});

// Handle song end event
mainAudio.addEventListener("ended", () => {
  switch (repeatBtn.innerText) {
    case "repeat":
      nextMusic();
      break;
    case "repeat_one":
      mainAudio.currentTime = 0;
      playMusic();
      break;
    case "shuffle":
      shuffleMusic();
      break;
  }
});

// Shuffle music
function shuffleMusic() {
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * allMusic.length);
  } while (randomIndex === musicIndex);
  musicIndex = randomIndex;
  loadMusic(musicIndex);
  playMusic();
  updatePlayingSong();
}

// Generate song list dynamically
allMusic.forEach((song, index) => {
  const liTag = `
  <li li-index="${index + 1}">
  <div class="row">
        <span>${song.name}</span>
        <p>${song.artist}</p>
      </div>
      <span id="${song.src}" class="audio-duration">3:40</span>
      <audio class="${song.src}" src="songs/${song.src}.mp3"></audio>
      </li> `;
  ulTag.insertAdjacentHTML("beforeend", liTag);

  const liAudioTag = ulTag.querySelector(`.${song.src}`);
  liAudioTag.addEventListener("loadeddata", () => {
    const duration = liAudioTag.duration;
    const totalMin = Math.floor(duration / 60);
    const totalSec = Math.floor(duration % 60)
      .toString()
      .padStart(2, "0");
    const durationTag = ulTag.querySelector(`#${song.src}`);
    durationTag.innerText = `${totalMin}:${totalSec}`;
    durationTag.setAttribute("t-duration", `${totalMin}:${totalSec}`);
  });

  // Add click event listener to each list item
  const liItem = ulTag.querySelector(`li[li-index="${index + 1}"]`);
  liItem.addEventListener("click", () => selectSong(liItem));
});

// Update the song that is currently playing in the list
function updatePlayingSong() {
  const allLiTags = ulTag.querySelectorAll("li");

  // Remove 'playing' class from all list items
  allLiTags.forEach((li) => {
    li.classList.remove("playing");
    const audioTag = li.querySelector(".audio-duration");
    const songDuration = audioTag.getAttribute("t-duration");
    audioTag.innerText = songDuration; // Reset to original duration
  });

  // Add 'playing' class to the current song
  const currentLi = ulTag.querySelector(`li[li-index="${musicIndex + 1}"]`);
  currentLi.classList.add("playing");

  // Update the duration text to "Playing"
  const currentAudioTag = currentLi.querySelector(".audio-duration");
  currentAudioTag.innerText = "Playing";
}

// Show/hide music list 
moreMusicBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});

closeMoreMusic.addEventListener("click", () => {
  musicList.classList.remove("show");
  pauseCurrentlyPlayingAudio(); // Pause any currently playing audio
  location.reload();
});

// Function to show the music list
function showMusicList() {
  const allLiTags = ulTag.querySelectorAll("li");
  allLiTags.forEach(li => li.style.display = 'block');
}

function hideMusicList() {
  const allLiTags = ulTag.querySelectorAll("li"); 
  allLiTags.forEach(li => li.style.display = 'none'); 
}

// Function to pause any currently playing audio
function pauseCurrentlyPlayingAudio() {
  if (currentSong) {
    currentSong.pause(); // Pause the currently playing song
    currentSong = null; // Reset currentSong to null
    clearInterval(countdownInterval); // Clear the countdown interval
  }
}

const resultsDiv = document.getElementById('results');

async function searchSong() {
  const songName = document.getElementById('songInput').value;
  const client_id = '2ab5e4df6ed44c90a3f8d181c1d6d341';
  const client_secret = '71b19df950254fe39c9e5a31b95f2de5';
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
    },
    body: 'grant_type=client_credentials'
  });
  const tokenData = await response.json();
  const accessToken = tokenData.access_token;
  const searchResponse = await fetch(`https://api.spotify.com/v1/search?q=${songName}&type=track`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  const data = await searchResponse.json();
  resultsDiv.innerHTML = '';
  hideMusicList(); // Hide the existing music list
  pauseCurrentlyPlayingAudio(); // Pause any currently playing audio before searching for new songs

  data.tracks.items.forEach((track, index) => {
    const trackElement = document.createElement('div');
    trackElement.innerHTML = `
      <div class="song-item" data-index="${index}">
        <p class="song-title" id="title-${track.id}"><strong>${track.name}</strong> by ${track.artists.map(artist => artist.name).join(', ')}</p>
        <span class="song-duration" id="duration-${track.id}"></span>
      </div>
      ${track.preview_url ? `<audio id="audio-${track.id}">
          <source src="${track.preview_url}" type="audio/mpeg">
          Your browser does not support the audio element.
      </audio>` : '<p>No preview available</p>'}
      <article class="song-controls"></article>
    `;

    const style = document.createElement('style');
    style.innerHTML = `
      .song-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding:0.5em;
      }
      .playing {
        color: var(--electric-blue);
      }
    `;
    document.head.appendChild(style);
    
    resultsDiv.appendChild(trackElement);

    const audioElement = trackElement.querySelector('audio');
    const songTitle = trackElement.querySelector(`#title-${track.id}`);
    const durationSpan = trackElement.querySelector(`#duration-${track.id}`);

    if (audioElement) {
      audioElement.addEventListener('loadedmetadata', () => {
        const minutes = Math.floor(audioElement.duration / 60);
        const seconds = Math.floor(audioElement.duration % 60);
        durationSpan.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      });

      songTitle.addEventListener('click', () => {
        if (currentSong && currentSong !== audioElement) {
          currentSong.pause();
          clearInterval(countdownInterval); // Stop the previous song's countdown
          document.querySelector(`#title-${currentSong.id.split('-')[1]}`).classList.remove('playing');
        }
        currentSong = audioElement;
        currentIndex = index;
        if (audioElement.paused) {
          audioElement.play();
          startCountdown(audioElement.duration, durationSpan); // Start countdown from the song duration
        } else {
          audioElement.pause();
          clearInterval(countdownInterval); // Stop countdown if paused
        }
        songTitle.classList.add('playing');
      });

      // Update the countdown display as the song plays
      audioElement.addEventListener('timeupdate', () => {
        updateCountdown(audioElement.currentTime, audioElement.duration, durationSpan);
      });
    }
  });
}

function startCountdown(duration, displayElement) {
  let remainingTime = duration;

  clearInterval(countdownInterval); // Clear any existing countdown
  countdownInterval = setInterval(() => {
    if (remainingTime <= 0) {
      clearInterval(countdownInterval);
      displayElement.innerText = '0:00';
      return;
    }
    const minutes = Math.floor(remainingTime / 60);
    const seconds = Math.floor(remainingTime % 60);
    displayElement.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    remainingTime--;
  }, 1000);
}

function updateCountdown(currentTime, duration, displayElement) {
  const remainingTime = duration - currentTime;
  const minutes = Math.floor(remainingTime / 60);
  const seconds = Math.floor(remainingTime % 60);
  displayElement.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}