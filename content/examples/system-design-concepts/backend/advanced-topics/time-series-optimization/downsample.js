function downsample(points, factor){
  const out=[];
  for(let i=0;i<points.length;i+=factor){
    out.push(points[i]);
  }
  return out;
}
module.exports={ downsample };