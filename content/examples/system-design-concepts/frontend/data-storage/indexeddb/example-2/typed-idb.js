class FakeStore {
  constructor() {
    this.items = new Map();
  }
  put(value) {
    this.items.set(value.id, value);
  }
  get(id) {
    return this.items.get(id) ?? null;
  }
}

class TypedRepository {
  constructor(store) {
    this.store = store;
  }
  save(record) {
    this.store.put(record);
    return record;
  }
  findById(id) {
    return this.store.get(id);
  }
}

const repo = new TypedRepository(new FakeStore());
repo.save({ id: "n1", title: "Offline queue", tag: "offline" });
console.log(repo.findById("n1"));

