import { createBroker } from "./broker.js";

const broker = createBroker();

broker.subscribe("*", (m) => process.stdout.write(`[ALL] ${m.topic}\n`));
broker.subscribe("auth.logout", (m) => process.stdout.write(`[AUTH] ${JSON.stringify(m.payload)}\n`));
broker.subscribe("toast", (m) => process.stdout.write(`[TOAST] ${m.payload.text}\n`));

broker.publish("toast", { text: "hello" });
broker.publish("auth.logout", { reason: "user_clicked" });
broker.publish("telemetry", { event: "page_view" });

process.stdout.write(`stats: ${JSON.stringify(broker.stats())}\n`);

