// Rebuild from snapshot if replay fails
state = loadSnapshot();
state = replayFrom(state, eventsSinceSnapshot);
