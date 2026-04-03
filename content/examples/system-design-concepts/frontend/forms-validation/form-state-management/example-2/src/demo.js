function reduceFormState(state, event) {
  if (event.type === "edit") return { ...state, values: { ...state.values, [event.key]: event.value }, dirty: [...new Set([...state.dirty, event.key])] };
  if (event.type === "partial-save") return { ...state, savedKeys: event.keys, dirty: state.dirty.filter((key) => !event.keys.includes(key)) };
  if (event.type === "discard") return { ...state, values: state.initialValues, dirty: [], savedKeys: [] };
  return state;
}

const initial = {
  initialValues: { workspaceName: "Platform Core", reviewers: "platform-lead,sre-oncall" },
  values: { workspaceName: "Platform Core", reviewers: "platform-lead,sre-oncall" },
  dirty: [],
  savedKeys: []
};

const edited = reduceFormState(initial, { type: "edit", key: "workspaceName", value: "Platform Runtime" });
const partiallySaved = reduceFormState({ ...edited, dirty: ["workspaceName", "reviewers"] }, { type: "partial-save", keys: ["workspaceName"] });
console.log({ edited, partiallySaved });
