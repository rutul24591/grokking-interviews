type User = { id: string; email: string };

interface UserStore {
  getById(id: string): Promise<User | null>;
  put(user: User): Promise<void>;
}

class InMemoryUserStore implements UserStore {
  private map = new Map<string, User>();
  async getById(id: string) {
    return this.map.get(id) ?? null;
  }
  async put(user: User) {
    this.map.set(user.id, user);
  }
}

async function main(store: UserStore) {
  await store.put({ id: "u1", email: "alice@example.com" });
  console.log(JSON.stringify({ user: await store.getById("u1") }, null, 2));
}

main(new InMemoryUserStore()).catch((e) => {
  console.error(e);
  process.exit(1);
});

