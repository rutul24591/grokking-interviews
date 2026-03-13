function transform(opA, opB){
  if (opA.pos <= opB.pos) return opB;
  return { ...opB, pos: opB.pos + opA.text.length };
}
module.exports = { transform };