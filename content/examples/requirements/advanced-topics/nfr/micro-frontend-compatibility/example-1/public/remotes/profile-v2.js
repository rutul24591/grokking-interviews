(function () {
  var TAG = "mf-profile";
  // v2 uses the same tag to simulate rolling upgrade; host loader swaps scripts.
  // If already defined, do nothing (reload would require page refresh).
  if (customElements.get(TAG)) return;

  function getHost() {
    return window.__MF_HOST__;
  }

  class ProfileV2 extends HTMLElement {
    connectedCallback() {
      var host = getHost();
      if (!host) {
        this.textContent = "Host contract not found";
        return;
      }
      var remote = "profile-v2";
      var hello = host.hello({ remote: remote, remoteVersion: 2 });
      host.emit({ type: "telemetry", name: "compat", value: hello.compat === "full" ? 1 : 0, remote: remote });

      this.renderSkeleton();
      host
        .getAuthToken("profile")
        .then(function (token) {
          this.render(token);
        }.bind(this))
        .catch(function (err) {
          host.emit({ type: "error", message: String(err), remote: remote });
          this.textContent = "Failed to load profile";
        }.bind(this));
    }

    renderSkeleton() {
      this.innerHTML =
        '<div style="padding:12px;border:1px solid #334155;border-radius:12px;background:rgba(2,6,23,0.4)">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px">' +
        '<div style="font-weight:800">Profile (v2)</div>' +
        '<span style="font-size:11px;opacity:0.8;border:1px solid #334155;padding:2px 8px;border-radius:999px">remote</span>' +
        "</div>" +
        '<div style="opacity:0.8;font-size:12px;margin-top:8px">Loading token…</div>' +
        "</div>";
    }

    render(token) {
      var host = getHost();
      var userId = this.getAttribute("user-id") || "unknown";
      var theme = this.getAttribute("theme") || "dark";
      var bg = theme === "light" ? "#ffffff" : "rgba(0,0,0,0.25)";
      var fg = theme === "light" ? "#0f172a" : "#e5e7eb";
      this.innerHTML =
        '<div style="padding:12px;border:1px solid #334155;border-radius:12px;background:' +
        bg +
        ";color:" +
        fg +
        '">' +
        '<div style="font-weight:800">Profile (v2)</div>' +
        '<div style="opacity:0.9;margin-top:6px">userId: <code>' +
        userId +
        "</code></div>" +
        '<div style="opacity:0.7;font-size:12px;margin-top:6px">audience token ok</div>' +
        '<div style="display:flex;gap:8px;margin-top:10px">' +
        '<button data-to="/settings" style="padding:6px 10px;border-radius:10px;border:1px solid #334155;background:#0ea5e9;color:#fff;font-weight:800;cursor:pointer">Settings</button>' +
        '<button data-to="/profile" style="padding:6px 10px;border-radius:10px;border:1px solid #334155;background:#334155;color:#fff;font-weight:800;cursor:pointer">Profile</button>' +
        "</div>" +
        "</div>";
      this.querySelectorAll("button").forEach(function (b) {
        b.addEventListener("click", function () {
          if (!host) return;
          host.emit({ type: "navigate", to: b.getAttribute("data-to"), remote: "profile-v2" });
        });
      });
      host.emit({ type: "telemetry", name: "rendered", value: token.length, remote: "profile-v2" });
    }
  }

  customElements.define(TAG, ProfileV2);
})();

