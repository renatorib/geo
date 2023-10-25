const SOUNDS_FOLDER = "/sounds"; /* public/sounds */

export const SOUNDS = {
  correct: "correct.wav",
  wind: "wind.mp3",
};

export type Sound = keyof typeof SOUNDS;

export const getSoundAudio = (name: Sound) => {
  return new Audio(SOUNDS_FOLDER + "/" + SOUNDS[name]);
};

export const playSound = (name: Sound, { volume = 1, playbackRate = 1 }) => {
  if (localStorage.getItem("gtf:sound") !== "false") {
    const audio = getSoundAudio(name);
    audio.playbackRate = playbackRate;
    audio.volume = volume;
    audio.play();
  }
};
