const widgets = [
  { name: "chat-widget", thirdParty: true, userInitiated: true, estimatedKb: 190 },
  { name: "reading-progress", thirdParty: false, userInitiated: false, estimatedKb: 4 },
  { name: "analytics-dashboard", thirdParty: true, userInitiated: true, estimatedKb: 220 },
];

function chooseStrategy(widget) {
  if (widget.thirdParty && widget.userInitiated) return "facade + lazy load on interaction";
  if (widget.estimatedKb > 80) return "lazy load after viewport or intent";
  return "ship eagerly or split by route";
}

for (const widget of widgets) {
  console.log(`${widget.name} -> ${chooseStrategy(widget)}`);
}
