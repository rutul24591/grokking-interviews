function trendingScore(item) {
  return item.views * 0.2 + item.saves * 0.8 + item.acceleration * 100 * 0.45;
}
console.log(trendingScore({ views: 200, saves: 20, acceleration: 0.5 }));
