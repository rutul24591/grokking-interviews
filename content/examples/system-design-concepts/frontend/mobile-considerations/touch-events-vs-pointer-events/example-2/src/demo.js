function chooseInputModel(surface) {
  const usePointer = surface.pointerSupported;
  const gesturePlan = surface.customGesture && surface.scrollContainer
    ? "isolate-gesture-zone"
    : surface.customGesture
      ? "gesture-safe"
      : "tap-only";
  return {
    id: surface.id,
    usePointer,
    gesturePlan,
    hoverFallbackRequired: !surface.hoverSupport
  };
}

const surfaces = [
  { id: "tablet", pointerSupported: true, customGesture: true, scrollContainer: false, hoverSupport: true },
  { id: "phone", pointerSupported: false, customGesture: true, scrollContainer: true, hoverSupport: false },
  { id: "simple", pointerSupported: false, customGesture: false, scrollContainer: false, hoverSupport: false }
];

console.log(surfaces.map(chooseInputModel));
