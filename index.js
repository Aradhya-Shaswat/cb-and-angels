
const song = document.getElementById("song");
const playButton = document.getElementById("play");
const playIcon = document.getElementById("play-icon");
const playText = document.getElementById("play-text");

const progress = document.getElementById("progress");
const currentTimeDisplay = document.getElementById("current");
const durationDisplay = document.getElementById("duration");

function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function updatePlayButton(isPlaying) {
    playText.textContent = isPlaying ? "Pause song" : "Play song";

    playButton.setAttribute(
        "aria-label",
        isPlaying ? "Pause song" : "Play song"
    );
}

playButton.addEventListener("click", async () => {
    if (song.paused) {
        try {
            await song.play();
        } catch (error) {
            console.error("Unable to play the audio:", error);
            updatePlayButton(false);
        }
    } else {
        song.pause();
    }
});

song.addEventListener("play", () => {
    updatePlayButton(true);
});

song.addEventListener("pause", () => {
    updatePlayButton(false);
});

song.addEventListener("loadedmetadata", () => {
    durationDisplay.textContent = formatTime(song.duration);
});

song.addEventListener("timeupdate", () => {
    currentTimeDisplay.textContent = formatTime(song.currentTime);

    if (Number.isFinite(song.duration) && song.duration > 0) {
        progress.value = (song.currentTime / song.duration) * 100;
    }
});

progress.addEventListener("input", () => {
    if (Number.isFinite(song.duration) && song.duration > 0) {
        song.currentTime = (Number(progress.value) / 100) * song.duration;
    }
});

song.addEventListener("ended", () => {
    progress.value = 0;
    currentTimeDisplay.textContent = "0:00";
    updatePlayButton(false);
});

song.addEventListener("error", () => {
    updatePlayButton(false);
    console.error("Audio could not be loaded. Check that audio.mp3 exists.");
});

updatePlayButton(false);
