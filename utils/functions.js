const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const getRandomHexColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

exports.capitalizeFirstLetter = capitalizeFirstLetter;
exports.getRandomHexColor = getRandomHexColor;
