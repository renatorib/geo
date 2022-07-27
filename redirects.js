const perm = (source, destination) => ({ source, destination, permanent: true });
// const temp = (source, destination) => ({ source, destination, permanent: false });

module.exports = [perm("/quiz/all", "/quiz/world")];
