function suppressLowVolumeSpike(item, minimumViews) {
  return item.views < minimumViews ? 'hold-out' : 'eligible';
}
console.log(suppressLowVolumeSpike({ views: 18 }, 50));
