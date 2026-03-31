This app now models the actual boot sequence for a third-party chat widget:

- the host fetches provider config first
- the widget script is then loaded asynchronously
- initialization happens only after the script is ready
- failures fall back to a first-party support path instead of leaving a broken launcher
