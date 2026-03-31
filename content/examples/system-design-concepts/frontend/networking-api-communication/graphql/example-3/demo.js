const response = {
  data: {
    article: { title: "GraphQL", comments: null }
  },
  errors: [{ path: ["article", "comments"], message: "comments resolver timeout" }]
};

const mergedView = {
  title: response.data.article.title,
  commentsState: response.errors.length > 0 ? "fallback to cached comments" : "use live comments"
};

console.log(JSON.stringify(mergedView, null, 2));
