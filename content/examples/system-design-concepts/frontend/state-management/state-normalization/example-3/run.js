const state = { users: { u1: { name: 'Tia' }, u2: { name: 'Mo' } }, comments: { c1: { authorId: 'u2' }, c2: { authorId: 'u1' } } };
state.users.u2 = { ...state.users.u2, name: 'Mo Khan' };
delete state.comments.c1;
console.log(state);
