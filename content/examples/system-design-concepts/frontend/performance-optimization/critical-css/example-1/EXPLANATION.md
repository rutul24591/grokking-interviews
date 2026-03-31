Example 1 is a full app demonstrating critical CSS as an architectural split:

- The article hero and summary styles are inlined in the document head so the first viewport can paint immediately.
- The rest of the styling is loaded later through a separate stylesheet request.
- A Node API supplies the page data, but the HTML and critical rules are enough for the first useful render.
