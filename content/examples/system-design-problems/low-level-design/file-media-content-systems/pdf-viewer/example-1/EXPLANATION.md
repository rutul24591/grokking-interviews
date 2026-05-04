# PDF Viewer — Full Implementation (Viewer State)

Example 1 models a PDF viewer subsystem:

- Page navigation + zoom state
- Text search state machine (query → matches → current match)
- Annotation model (highlights, comments) with coordinates

Interview focus:
- Virtualizing pages for large PDFs
- Maintaining consistent coordinates across zoom/rotation

