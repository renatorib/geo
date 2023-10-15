const SOUNDS_FOLDER = "/sounds"; /* public/sounds */

export const SOUNDS = {
  correct: "correct.wav",
};

export type Sound = keyof typeof SOUNDS;

export const getSoundAudio = (name: Sound) => {
  return new Audio(SOUNDS_FOLDER + "/" + SOUNDS[name]);
};

export const playSound = (name: Sound) => {
  if (localStorage.getItem("gtf:sound") !== "false") {
    const audio = getSoundAudio(name);
    audio.play();
  }
};
