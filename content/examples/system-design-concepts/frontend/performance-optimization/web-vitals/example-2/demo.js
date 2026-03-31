const shifts = [
  { impactFraction: 0.5, distanceFraction: 0.125 },
  { impactFraction: 0.2, distanceFraction: 0.1 },
];
const totalCls = shifts.reduce((sum, shift) => sum + shift.impactFraction * shift.distanceFraction, 0);
console.log(`CLS window score -> ${totalCls.toFixed(4)}`);
