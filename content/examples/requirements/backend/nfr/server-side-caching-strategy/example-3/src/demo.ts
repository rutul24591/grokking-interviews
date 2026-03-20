class TagIndex {
  private byTag = new Map<string, Set<string>>();

  tag(tag: string, key: string) {
    const set = this.byTag.get(tag) ?? new Set<string>();
    set.add(key);
    this.byTag.set(tag, set);
  }

  invalidate(tag: string) {
    const keys = [...(this.byTag.get(tag) ?? new Set())];
    this.byTag.delete(tag);
    return keys;
  }
}

const idx = new TagIndex();
idx.tag("user:u1", "profile:u1");
idx.tag("user:u1", "feed:u1");
console.log(JSON.stringify({ invalidate: idx.invalidate("user:u1") }, null, 2));

