function score(user, item) { return user.interests.includes(item.category) ? 0.9 : 0.1; }
module.exports = { score };