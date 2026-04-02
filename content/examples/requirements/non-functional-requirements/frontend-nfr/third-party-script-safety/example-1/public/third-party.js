(function () {
  function safeLocalStorageAccessible() {
    try {
      var k = "__t";
      localStorage.setItem(k, "1");
      localStorage.removeItem(k);
      return true;
    } catch (e) {
      return false;
    }
  }

  var cookiesVisible = document.cookie.length > 0;
  var localStorageAccessible = safeLocalStorageAccessible();

  // Report capabilities to parent. In a sandbox without allow-same-origin, origin is "null".
  parent.postMessage(
    { type: "capabilities", cookiesVisible: cookiesVisible, localStorageAccessible: localStorageAccessible },
    "*",
  );

  var btn = document.getElementById("emit");
  if (btn) {
    btn.addEventListener("click", function () {
      parent.postMessage({ type: "metric", name: "widget_click", value: 1 }, "*");
    });
  }
})();

