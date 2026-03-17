// On conflict, surface both versions
if (!dominates(a, b) && !dominates(b, a)) conflictHandler(a, b);
