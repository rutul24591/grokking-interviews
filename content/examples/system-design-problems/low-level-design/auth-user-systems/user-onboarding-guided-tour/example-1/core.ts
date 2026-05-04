export type TourStep = {
  id: string;
  title: string;
  selector: string; // UI anchor
  required: boolean;
};

export type TourState = {
  tourId: string;
  version: number;
  active: boolean;
  stepIndex: number;
  completedStepIds: Set<string>;
  updatedAt: number;
};

export function start(tourId: string, version: number, steps: TourStep[]): TourState {
  return { tourId, version, active: true, stepIndex: 0, completedStepIds: new Set(), updatedAt: Date.now() };
}

export function next(state: TourState, steps: TourStep[]) {
  const cur = steps[state.stepIndex];
  const completed = new Set(state.completedStepIds);
  if (cur) completed.add(cur.id);
  return { ...state, stepIndex: Math.min(steps.length - 1, state.stepIndex + 1), completedStepIds: completed, updatedAt: Date.now() };
}

export function dismiss(state: TourState) {
  return { ...state, active: false, updatedAt: Date.now() };
}

export function serialize(state: TourState) {
  return JSON.stringify({
    tourId: state.tourId,
    version: state.version,
    active: state.active,
    stepIndex: state.stepIndex,
    completed: [...state.completedStepIds],
    updatedAt: state.updatedAt,
  });
}
