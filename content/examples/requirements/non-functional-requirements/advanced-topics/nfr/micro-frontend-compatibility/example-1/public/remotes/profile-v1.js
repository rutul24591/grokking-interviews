(function () {
  var TAG = "mf-profile";
  if (customElements.get(TAG)) return;

  function getHost() {
    return window.__MF_HOST__;
  }

  class ProfileV1 extends HTMLElement {
    connectedCallback() {
      var host = getHost();
      if (!host) {
        this.textContent = "Host contract not found";
        return;
      }
      var remote = "profile-v1";
      try {
        host.hello({ remote: remote, remoteVersion: 1 });
      } catch (e) {
        // best effort
      }

      this.renderLoading();
      host
        .getAuthToken()
        .then(function (token) {
          host.emit({ type: "telemetry", name: "token_len", value: token.length, remote: remote });
          this.render(token);
        }.bind(this))
        .catch(function (err) {
          host.emit({ type: "error", message: String(err), remote: remote });
          this.textContent = "Failed to load profile";
        }.bind(this));
    }

    renderLoading() {
      this.innerHTML =
        '<div style="padding:12px;border:1px solid #334155;border-radius:12px;background:rgba(0,0,0,0.25)">' +
        '<div style="font-weight:700">Profile (v1)</div>' +
        '<div style="opacity:0.8;font-size:12px">Loading...</div>' +
        "</div>";
    }

    render(token) {
      var userId = this.getAttribute("user-id") || "unknown";
      this.innerHTML =
        '<div style="padding:12px;border:1px solid #334155;border-radius:12px;background:rgba(0,0,0,0.25)">' +
        '<div style="font-weight:700">Profile (v1)</div>' +
        '<div style="opacity:0.9;margin-top:6px">userId: <code>' +
        userId +
        "</code></div>" +
        '<div style="opacity:0.7;font-size:12px;margin-top:6px">token: <code>' +
        token.slice(0, 18) +
        "…</code></div>" +
        '<button style="margin-top:10px;padding:6px 10px;border-radius:10px;border:1px solid #334155;background:#0ea5e9;color:#fff;font-weight:700;cursor:pointer">Go settings</button>' +
        "</div>";
      var btn = this.querySelector("button");
      btn.addEventListener("click", function () {
        var host = getHost();
        if (!host) return;
        host.emit({ type: "navigate", to: "/settings", remote: "profile-v1" });
      });
    }
  }

  customElements.define(TAG, ProfileV1);
})();

