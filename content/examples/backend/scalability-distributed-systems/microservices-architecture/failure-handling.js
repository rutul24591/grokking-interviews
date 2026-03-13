// Open circuit after repeated failures
if (errors > 3) openCircuit('billing');
