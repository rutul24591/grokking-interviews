// Simplified Raft-like state machine
let role = 'follower';
let term = 0;

function onElectionTimeout() {
  role = 'candidate';
  term += 1;
  requestVotes(term);
}

function onAppendEntries(term, entries) {
  if (term >= this.term) {
    this.term = term;
    role = 'follower';
    appendLog(entries);
  }
}
