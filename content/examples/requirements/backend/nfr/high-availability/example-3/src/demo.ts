class FencedWriter {
  private currentToken = 0;
  private value = "";

  electNewLeader() {
    this.currentToken++;
    return this.currentToken;
  }

  write(token: number, v: string) {
    if (token !== this.currentToken) throw new Error("stale_fencing_token");
    this.value = v;
  }

  read() {
    return this.value;
  }
}

const w = new FencedWriter();
const t1 = w.electNewLeader();
w.write(t1, "v1");

const t2 = w.electNewLeader();
try {
  w.write(t1, "oops"); // old leader trying to write
} catch (e) {
  // expected
}
w.write(t2, "v2");

console.log(JSON.stringify({ value: w.read(), t1, t2 }, null, 2));

