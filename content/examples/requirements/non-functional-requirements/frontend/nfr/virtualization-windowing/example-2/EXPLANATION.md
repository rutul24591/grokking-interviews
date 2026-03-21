# The core math

Windowing is mostly:
- compute start index from scrollTop,
- compute end index from viewportHeight,
- add overscan,
- translate the inner container by `start * rowHeight`.

