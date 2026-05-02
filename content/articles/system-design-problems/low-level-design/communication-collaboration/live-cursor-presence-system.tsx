"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-live-cursor-presence-system",
  title: "Design a Live Cursor / Presence System",
  description:
    "LLD for live cursors and presence: throttled cursor broadcasts, smooth interpolation, presence list with colors, idle/away detection, and cleanup on disconnect.",
  category: "low-level-design",
  subcategory: "communication-collaboration",
  slug: "live-cursor-presence-system",
  wordCount: 6000,
  readingTime: 32,
  lastUpdated: "2026-04-30",
  tags: ["lld", "presence", "live-cursors", "real-time", "react"],
  relatedTopics: [
    "real-time-collaborative-editor",
    "presence-last-seen-system",
    "collaborative-whiteboard",
  ],
};

export default function LiveCursorPresenceSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

        <h3>Problem Statement</h3>
        <p>
          We are designing a live cursor and presence
          system — the layer that shows where other
          users are clicking, hovering, or focusing
          in a shared interface (Figma, Notion,
          collaborative editor, multiplayer
          whiteboards). Each user&rsquo;s cursor
          renders as a colored arrow with a name
          label that follows their movements
          smoothly. Presence list shows who is
          currently in the room. The system handles
          throttled broadcasting (don&rsquo;t flood
          the network at every mousemove), smooth
          interpolation between received positions,
          idle/away detection, and cleanup on
          disconnect.
        </p>
        <p>
          The hard problems are: throttling
          high-frequency cursor events (mousemove
          fires hundreds of times per second);
          interpolation so cursors move smoothly
          between received positions rather than
          teleporting; idle detection (mark users
          away after inactivity); cleanup on
          disconnect (remove cursors of users who
          left); coordinate transformation (a cursor
          in room A maps to where in viewer B&rsquo;s
          viewport?); and accessibility (screen
          readers should know who is present
          without spam).
        </p>

        <h3>User Context</h3>
        <p>
          End users see other collaborators&rsquo;
          cursors and presence. Engineering teams
          plug in: provide a transport (WebSocket or
          a CRDT awareness channel), broadcast cursor
          positions, render received positions as
          cursors.
        </p>

        <h3>Assumptions</h3>
        <p>
          Transport is the collaborative editor&rsquo;s
          awareness channel (Yjs awareness) or a
          WebSocket. Each user has metadata (id,
          name, color). Modern browsers; we use
          requestAnimationFrame for smooth
          interpolation, Page Visibility API for
          idle detection.
        </p>

        <h3>Non-Goals</h3>
        <p>
          We do not implement the underlying real-time
          system (separate). We do not implement
          last-seen-time persistence (separate
          Presence + Last Seen system). We do not
          implement video avatars.
        </p>
      </section>

      <section>
        <h2>⚙️ Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <p>
          Broadcast local cursor position
          (throttled). Receive remote positions
          and render with smooth interpolation.
          Per-user color (consistent across
          sessions). Name label near each cursor.
          Presence list (avatars/names of active
          users). Idle/away state after inactivity
          (e.g. 30 s); resume on activity.
          Disconnect cleanup (remove cursor when
          user leaves).
        </p>

        <h3>Secondary (Nice-to-have)</h3>
        <p>
          Selection broadcast (other users see
          your text selection). Element-attached
          cursors (cursor near a UI element rather
          than absolute coordinates). Cursor
          chat (small text bubble). Following
          mode (follow another user&rsquo;s
          viewport). Reactions (a small emoji
          near the cursor that fades). Cursor
          trails for emphasis.
        </p>

        <h3>Out of Scope</h3>
        <p>
          The transport, last-seen tracking,
          video presence, voice chat.
        </p>
      </section>

      <section>
        <h2>📊 Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <p>
          Cursor broadcast throttled to ~30 Hz
          (every ~33 ms). Receiving and rendering
          at 60 fps with interpolation. Many
          cursors (10+) without jank. Bandwidth
          bounded — cursor messages are tiny but
          frequent.
        </p>

        <h3>Reliability</h3>
        <p>
          Cursors removed on disconnect. Stale
          cursors timeout (e.g. 5 s without
          update → mark stale). Idle detection
          accurate.
        </p>

        <h3>Security</h3>
        <p>
          Cursor messages authenticated. Cross-room
          isolation enforced server-side. User
          metadata sanitized.
        </p>

        <h3>Accessibility</h3>
        <p>
          Presence list screen-reader-accessible
          (real list with user names). Cursor
          appearances/disappearances don&rsquo;t
          spam announcements (live region throttled
          to room-level state changes only).
        </p>

        <h3>Maintainability</h3>
        <p>
          Pluggable transport. User metadata
          schema simple and extensible. Cursor
          rendering plug-in (custom cursor
          components per product).
        </p>
      </section>

      <section>
        <h2>🧠 Solution Approach</h2>
        <p>
          The system has four parts: <strong>cursor
          broadcaster</strong> (throttle local
          cursor and broadcast), <strong>cursor
          receiver</strong> (apply remote positions
          with interpolation), <strong>presence
          tracker</strong> (track who is in the
          room with idle state), and <strong>cleanup
          mechanism</strong> (remove cursors on
          disconnect or staleness).
        </p>
        <p>
          The <strong>broadcaster</strong> listens to
          mousemove (and click, drag, etc. as
          configured). Throttle to ~30 Hz: at most
          one broadcast per ~33 ms. Each broadcast
          contains the local cursor position
          (typically as document coordinates or
          element-relative coordinates, not viewport
          coordinates so different viewers can
          interpret correctly). The transport ships
          to other clients.
        </p>
        <p>
          The <strong>receiver</strong> applies
          incoming positions per remote user. We
          maintain a per-user state{" "}
          <code>{` { lastPos, targetPos, lastReceived } `}</code>.
          On each render frame
          (requestAnimationFrame), we interpolate
          from
          <code> lastPos</code> toward
          <code> targetPos</code> by a fraction
          (e.g. 0.2 per frame), giving a smooth
          eased motion. Without interpolation,
          cursors would teleport between received
          positions — visually jarring at any
          throttle rate below 60 Hz. With
          interpolation, even a 30 Hz update rate
          appears as smooth movement.
        </p>
        <p>
          <strong>Coordinate transformation</strong>:
          cursor positions broadcast in document
          coordinates (e.g. relative to a canvas&rsquo;s
          origin). Each viewer transforms to their
          own viewport (accounting for scroll, zoom,
          pan). This way, two users at different
          zoom levels see each other&rsquo;s cursors
          at correct logical positions.
        </p>
        <p>
          <strong>Per-user color</strong>: deterministic
          assignment from user id (hash to a curated
          color palette). Same user always gets the
          same color. Color carries to the cursor
          and the user&rsquo;s presence avatar.
        </p>
        <p>
          <strong>Name label</strong> near the cursor
          (typically below-right, configurable).
          Truncates long names. Hides on idle to
          reduce visual clutter.
        </p>
        <p>
          <strong>Idle detection</strong>: track last
          activity per user. If no activity for
          a threshold (e.g. 30 s on cursor; 60 s
          on tab visibility), mark the user idle.
          Idle cursors render with reduced opacity.
          Activity (mousemove, click, keypress)
          resumes active state. Tab hidden/visible
          via Page Visibility API also drives
          idle.
        </p>
        <p>
          <strong>Disconnect cleanup</strong>: when
          a user disconnects (tab close,
          navigation, network drop), the transport
          fires an event; we remove their cursor
          and presence. As a backup, cursors with
          no update for 5 s are considered stale
          and removed.
        </p>
        <p>
          <strong>Presence list</strong> renders all
          active users with avatars and names,
          color-coded matching cursor colors.
          Idle users dim. Click an avatar to follow
          (jump viewport to their position).
        </p>
        <p>
          <strong>Selection broadcast</strong>: in
          editors, broadcast the text or element
          selection alongside cursor. Render
          remote selections as colored highlights
          in the document. Same throttle and
          interpolation apply.
        </p>
      </section>

      <section>
        <h2>🧱 Component Architecture</h2>
        <p>
          <strong>PresenceProvider</strong>{" "}
          instantiates broadcaster, receiver,
          tracker. <strong>CursorBroadcaster</strong>{" "}
          listens to mousemove and ships
          throttled. <strong>CursorReceiver</strong>{" "}
          interpolates remote cursors.
          <strong> CursorOverlay</strong> renders
          cursor SVGs. <strong>PresenceList</strong>{" "}
          renders user list.
          <strong> IdleDetector</strong> tracks
          activity. <strong>StaleCursorCleaner</strong>{" "}
          removes cursors with no recent updates.
        </p>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <p>
          Cursor positions per remote user in a
          ref-backed map (no React re-render on
          every interpolation step). React
          subscribes via the cursor overlay
          which re-renders per RAF tick.
          Presence list state in external store.
        </p>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <p>
          Cursor message:{" "}
          <code>{` { userId, x, y, timestamp, selection? } `}</code>.
          User metadata:{" "}
          <code>{` { id, name, color, avatar? } `}</code>.
          Presence message:{" "}
          <code>{` { type: "join" | "leave" | "update", userId, metadata? } `}</code>.
        </p>
      </section>

      <section>
        <h2>⚡ Performance</h2>
        <p>
          Throttle broadcasts to 30 Hz.
          Interpolation runs in RAF for smooth
          rendering. Cursor SVG renders are
          cheap; many cursors don&rsquo;t cause
          jank. Presence list updates batched.
          Idle state changes are infrequent.
        </p>
      </section>

      <section>
        <h2>🎨 UX</h2>
        <p>
          Cursors are colored arrows with a small
          name label. Smooth movement. Idle
          cursors fade. Presence list near the
          top of the room. Click to follow
          users. Selection highlights in document
          subtle but clear. Disconnect feels
          natural (cursor disappears).
        </p>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <p>
          Presence list is a real list with user
          names. Cursor visuals are decorative
          (don&rsquo;t spam announcements). Room
          state changes (X joined, Y left)
          announce in chunks via polite live
          region. Following affordances are
          keyboard-accessible.
        </p>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <p>
          Authenticated transport. Server enforces
          room membership. User metadata
          server-validated. Cursor positions are
          data; no malicious payload risk.
        </p>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <p>
          Unit tests for throttle and interpolation.
          Integration tests with simulated
          peers: cursor smooth on receiver;
          disconnect cleans up; idle detection
          fires. Visual regression tests for
          cursor rendering.
        </p>
      </section>

      <section>
        <h2>🚨 Edge Cases</h2>
        <p>
          Network jitter: interpolation smooths
          over irregular updates. User goes idle
          mid-broadcast: idle state fires after
          threshold. Cursor goes off-canvas:
          render at edge or hide. Many cursors in
          one spot: stack with offset for
          legibility. User reconnects after
          long disconnect: rejoin with new
          cursor; old stale removed via timeout.
          Page zoom or scroll: coordinate
          transformation keeps cursor at
          logically-correct position.
        </p>
      </section>

      <section>
        <h2>🔁 Reusability</h2>
        <p>
          Generic over transport. Cursor renderer
          customizable. Pattern reuses across
          collaborative editors, whiteboards,
          design tools.
        </p>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <p>
          User names display as authored.
          Following affordance label via i18n.
          RTL doesn&rsquo;t affect cursor logic
          (positions are absolute).
        </p>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

        <h3>Throttle rate vs bandwidth</h3>
        <p>
          30 Hz feels smooth with interpolation
          and uses moderate bandwidth. 60 Hz
          would feel native but doubles
          bandwidth. 10 Hz feels choppy even
          with interpolation. 30 Hz is the
          sweet spot.
        </p>

        <h3>Linear vs eased interpolation</h3>
        <p>
          Eased (e.g. fraction per frame) feels
          smoother. Linear is simpler but more
          mechanical. We use eased.
        </p>

        <h3>Document vs viewport coordinates</h3>
        <p>
          Document coordinates work across
          viewers with different zoom/scroll;
          viewport coordinates would need
          translation per viewer. Document
          coordinates are the right canonical.
        </p>

        <h3>Awareness vs separate channel</h3>
        <p>
          CRDT awareness (Yjs) provides ephemeral
          state separate from document state. A
          separate WebSocket channel works too.
          Awareness is cleaner when CRDT is
          already in use.
        </p>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <p>
          Cursor reactions (emoji bursts).
          Voice chat alongside cursors. Cursor
          following mode for guided tours.
          Spatial audio (audio louder near
          your cursor). Group cursor (multiple
          users acting as one).
        </p>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <p>
          <strong>1. How do cursors move
          smoothly?</strong> Throttled broadcast at
          ~30 Hz; receiver interpolates between
          received positions per RAF frame
          (eased fraction). Even at 30 Hz, the
          motion appears 60 fps smooth.
        </p>

        <p>
          <strong>2. How do you avoid network
          flood?</strong> Throttle mousemove to
          one broadcast per ~33 ms. Interpolation
          fills in the gaps locally.
        </p>

        <p>
          <strong>3. How are cursors cleaned
          up?</strong> Disconnect events fire
          cleanup. Stale cursors (no update for
          5 s) timeout. Both cover the cases
          where the disconnect didn&rsquo;t
          fire cleanly.
        </p>

        <p>
          <strong>4. How is idle
          detected?</strong> Track last activity;
          if none for threshold, mark idle.
          Page Visibility API integration for
          tab-hidden idle.
        </p>

        <p>
          <strong>5. Why document
          coordinates?</strong> Different viewers
          may have different zoom and scroll;
          document coordinates work across all
          viewers without per-viewer translation
          on broadcast.
        </p>

        <p>
          <strong>6. How do users get consistent
          colors?</strong> Deterministic
          hash from user id to a curated palette.
          Same user gets same color across
          sessions and across viewers.
        </p>

        <p>
          <strong>7. How is this
          accessible?</strong> Presence list as a
          real list. Cursor visuals decorative,
          not announced. Room state changes
          (join/leave) announce in chunks.
          Following affordances keyboard-
          accessible.
        </p>

        <p>
          <strong>8. How does this relate to the
          collaborative editor?</strong> The
          editor uses the same awareness channel
          for cursors and presence. Live cursor
          system can also work standalone (e.g.
          on a whiteboard) with its own
          transport.
        </p>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <p>
          A live cursor / presence system is{" "}
          <strong>throttled broadcast + RAF
          interpolation + idle detection +
          disconnect cleanup</strong>. Document
          coordinates work across viewers;
          deterministic colors stay consistent;
          interpolation makes 30 Hz updates
          feel 60 fps smooth. The result is the
          ambient awareness that makes
          collaboration feel alive.
        </p>
      </section>
    </ArticleLayout>
  );
}
