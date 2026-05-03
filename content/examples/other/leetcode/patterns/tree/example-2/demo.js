function inorder(root, out=[]) { if(!root) return out; inorder(root.left,out); out.push(root.value); inorder(root.right,out); return out; }
const tree = { value: 2, left: { value: 1 }, right: { value: 3 } };
console.log(inorder(tree));
