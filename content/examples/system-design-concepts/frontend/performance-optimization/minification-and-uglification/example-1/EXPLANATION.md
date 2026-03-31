Example 1 is a full app that treats minification as an operational build concern rather than a theoretical transform.

It demonstrates:
- a real `esbuild.transform()` minification pass on representative JS and CSS bundles
- the size delta between original and minified output
- the additional savings after transport compression
- source-map policy visibility, which matters for both debugging and security
- concrete before/after code previews so the optimization is inspectable rather than just reported
