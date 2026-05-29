function excerpt(text, maxLength = 132) {
  return text.length <= maxLength ? text : `${text.slice(0, maxLength - 1)}…`;
}

module.exports = { excerpt };
