const events = [];
function append(event) { events.push(event); }
function rebuild() {
  return events.reduce((state, e) => {
    if (e.type == 'Deposited') state.balance += e.amount;
    if (e.type == 'Withdrawn') state.balance -= e.amount;
    return state;
  }, { balance: 0 });
}

append({ type: 'Deposited', amount: 50 });
console.log(rebuild());
