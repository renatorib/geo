const perm = (source, destination) => ({ source, destination, permanent: true });
// const temp = (source, destination) => ({ source, destination, permanent: false });

module.exports = [
  // Fist refac
  perm("/quiz/all", "/quiz/world"),
  perm("/quiz/:name*", "/flags/:name*"),

  // Second refac
  perm("/flags/:name*", "play/flags/:name*"),
  perm("/shapes/:name*", "play/shapes/:name*"),
  perm("/others/world-map", "play/map/world"),
];
