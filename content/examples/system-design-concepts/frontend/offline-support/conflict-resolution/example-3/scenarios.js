import { ReplicaVector, VersionVector } from "./vector.js";

function createRecord({ title, body, vector }) {
  return { title, body, vector };
}

function orderedUpdateScenario() {
  const base = new VersionVector({ phone: 1, server: 1 });
  const server = new ReplicaVector("server", base.snapshot());
  server.tick();

  return {
    name: "causally ordered update",
    incoming: createRecord({
      title: "Design doc",
      body: "Server approved copy",
      vector: server.snapshot()
    }),
    local: createRecord({
      title: "Design doc",
      body: "Draft copy",
      vector: base.snapshot()
    }),
    expected: "Incoming update is after local state and can be applied automatically."
  };
}

function concurrentEditScenario() {
  const base = new VersionVector({ phone: 1, laptop: 1, server: 1 });
  const phone = new ReplicaVector("phone", base.snapshot());
  const laptop = new ReplicaVector("laptop", base.snapshot());
  phone.tick();
  laptop.tick();

  return {
    name: "true concurrent offline edits",
    incoming: createRecord({
      title: "Trip notes",
      body: "Updated on laptop",
      vector: laptop.snapshot()
    }),
    local: createRecord({
      title: "Trip notes",
      body: "Updated on phone",
      vector: phone.snapshot()
    }),
    expected: "Neither version dominates; the client must surface a conflict or use a richer merge strategy."
  };
}

function staleReplayScenario() {
  const base = new VersionVector({ phone: 2, server: 3, laptop: 1 });
  const server = new ReplicaVector("server", base.snapshot());
  server.tick();

  return {
    name: "stale client replay after merge",
    incoming: createRecord({
      title: "Weekly plan",
      body: "Old phone draft",
      vector: { phone: 2, server: 1, laptop: 1 }
    }),
    local: createRecord({
      title: "Weekly plan",
      body: "Server merged draft",
      vector: server.snapshot()
    }),
    expected: "The replay is before local state and should be rejected as stale."
  };
}

function mergedReplicaScenario() {
  const base = new VersionVector({ phone: 1, laptop: 1, server: 1 });
  const phone = new ReplicaVector("phone", base.snapshot());
  const laptop = new ReplicaVector("laptop", base.snapshot());
  phone.tick();
  laptop.tick();

  const reconciledServer = new ReplicaVector("server", {});
  reconciledServer.merge(phone.snapshot());
  reconciledServer.merge(laptop.snapshot());
  reconciledServer.tick();

  return {
    name: "server reconciliation supersedes both replicas",
    incoming: createRecord({
      title: "Shared task list",
      body: "Server-approved merged result",
      vector: reconciledServer.snapshot()
    }),
    local: createRecord({
      title: "Shared task list",
      body: "Phone draft",
      vector: phone.snapshot()
    }),
    expected: "Once the server emits a merged successor, replicas can advance to it without manual resolution."
  };
}

export const scenarios = [
  orderedUpdateScenario(),
  concurrentEditScenario(),
  staleReplayScenario(),
  mergedReplicaScenario()
];
