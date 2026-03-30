const keyframes = [
  { offset: 0, transform: "translateX(0px)" },
  { offset: 0.6, transform: "translateX(120px)" },
  { offset: 1, transform: "translateX(180px)" },
];
console.log("WAAPI keyframe plan\n");
for (const frame of keyframes) console.log(`offset=${frame.offset} -> ${frame.transform}`);
