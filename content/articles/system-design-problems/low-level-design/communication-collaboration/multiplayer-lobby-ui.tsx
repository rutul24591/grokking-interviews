"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-multiplayer-lobby-ui",
  title: "Design a Multiplayer Lobby UI",
  description:
    "LLD for a multiplayer lobby: room list, real-time membership updates, ready states, host controls, matchmaking handoff, and accessibility.",
  category: "low-level-design",
  subcategory: "communication-collaboration",
  slug: "multiplayer-lobby-ui",
  wordCount: 5500,
  readingTime: 29,
  lastUpdated: "2026-04-30",
  tags: ["lld", "multiplayer", "lobby", "real-time", "react"],
  relatedTopics: [
    "presence-last-seen-system",
    "real-time-collaborative-editor",
    "chat-messaging-ui",
  ],
};

export default function MultiplayerLobbyUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

        <h3>Problem Statement</h3>
        <p>
          We are designing a multiplayer lobby —
          the UI where users gather before a game
          (or shared session) starts. Users see
          available rooms, join one, see other
          members, mark themselves ready, and the
          host starts the session. Lobbies appear
          in games, online classroom tools,
          virtual events, and any shared session
          with a coordinated start.
        </p>
        <p>
          The hard problems are: real-time room
          membership updates (people joining and
          leaving); ready states with host
          coordination (start when all ready);
          host controls (kick, change settings);
          handoff to the actual session/game on
          start; reconnection if a member drops;
          accessibility for the lobby UI.
        </p>

        <h3>User Context</h3>
        <p>
          End users join lobbies to play or
          collaborate. They expect to see who&rsquo;s
          in the room, mark themselves ready, and
          have the host start. Engineering teams
          provide a lobby backend (typically
          WebSocket-based) and the runtime
          handles UI.
        </p>

        <h3>Assumptions</h3>
        <p>
          Backend exposes WebSocket events for
          room membership, ready state changes,
          host actions. Authentication identifies
          users.
        </p>

        <h3>Non-Goals</h3>
        <p>
          The actual game/session, matchmaking
          algorithms (the lobby&rsquo;s job is
          coordination, not selection), voice
          chat (typically separate).
        </p>
      </section>

      <section>
        <h2>⚙️ Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <p>
          Room list (browse available rooms with
          name, member count, status). Create
          room. Join room. Leave room. Member
          list per room with ready state. Ready
          toggle for self. Host controls: kick,
          change settings, start. Start gates on
          all-ready (or host-override). Real-time
          updates as members join/leave/toggle
          ready. Handoff to session on start.
        </p>

        <h3>Secondary (Nice-to-have)</h3>
        <p>
          Room chat. Voice chat integration.
          Spectator mode. Custom room settings
          (game mode, map, etc.). Skill-based
          matchmaking (auto-join). Friends-only
          rooms. Region selection. Anti-griefing
          (minimum ready time, vote-kick).
        </p>

        <h3>Out of Scope</h3>
        <p>
          The session itself, voice chat
          backend, matchmaking algorithms.
        </p>
      </section>

      <section>
        <h2>📊 Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <p>
          Membership updates within ~100 ms. Room
          list updates smooth even with many
          rooms (virtualize if needed).
        </p>

        <h3>Reliability</h3>
        <p>
          Reconnection re-joins room if still
          available. Host disconnect transfers
          host (or closes room). Stale rooms
          time out.
        </p>

        <h3>Security</h3>
        <p>
          Authenticated WebSocket. Server enforces
          host privileges. Anti-spam on room
          creation.
        </p>

        <h3>Accessibility</h3>
        <p>
          Room list as a navigable list. Member
          list accessible. Ready toggle is a real
          button. State changes announce.
        </p>

        <h3>Maintainability</h3>
        <p>
          Lobby state in a small store. Settings
          schema declarative. Plugins for chat,
          voice.
        </p>
      </section>

      <section>
        <h2>🧠 Solution Approach</h2>
        <p>
          The lobby has three planes: <strong>room
          list</strong> (browse + create + join),
          <strong> active room</strong> (members,
          ready, settings, host controls), and
          <strong> handoff</strong> (transition
          to the session on start). Real-time via
          WebSocket; reconnection logic from the
          presence subsystem.
        </p>
        <p>
          The <strong>room list</strong> subscribes
          to a stream of room updates. New rooms
          appear; full or started rooms drop.
          User clicks to join. Filtering and
          sorting by criteria (player count,
          mode, region).
        </p>
        <p>
          The <strong>active room</strong> view
          subscribes to that room&rsquo;s
          membership and state. Members render
          with ready indicators. The current user
          can toggle their ready state. Host
          sees additional controls.
        </p>
        <p>
          On <strong>join</strong>: send join
          request to backend. Server validates
          (capacity, permissions) and adds the
          user. Other members&rsquo; UIs update
          via WebSocket broadcast.
        </p>
        <p>
          On <strong>ready toggle</strong>: send
          ready event. Server updates state.
          Other members see updated indicator.
          When all members are ready (or host
          overrides), the host&rsquo;s Start
          button enables.
        </p>
        <p>
          On <strong>start</strong>: host clicks
          Start. Backend validates and transitions
          the room from lobby to session.
          Members receive a session-start event
          and navigate to the game/session.
        </p>
        <p>
          <strong>Host disconnect</strong>: the
          backend detects via heartbeat or
          WebSocket close. The lobby transfers
          host to the next member (or closes if
          empty). Other members see the host
          change.
        </p>
        <p>
          <strong>Member disconnect</strong>: backend
          marks the member offline. Optionally
          gives them a window to reconnect before
          removing. Members see status change.
        </p>
        <p>
          <strong>Settings changes</strong>: host
          changes settings (e.g. map, game mode);
          server validates and broadcasts. All
          members see the new settings; ready
          state may reset (you ready up against
          specific settings).
        </p>
      </section>

      <section>
        <h2>🧱 Component Architecture</h2>
        <p>
          <strong>LobbyProvider</strong>{" "}
          instantiates backend connection.
          <strong> RoomList</strong> renders
          available rooms. <strong>RoomCard</strong>{" "}
          renders one room. <strong>ActiveRoom</strong>{" "}
          renders the joined room.
          <strong> MemberList</strong> renders
          members with ready states.
          <strong> ReadyToggle</strong> for self.
          <strong> HostControls</strong> for
          host. <strong>SettingsPanel</strong>{" "}
          for room settings.
        </p>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <p>
          Room list, active room state,
          membership, ready states in external
          store. Connection state in connection
          store.
        </p>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <p>
          Events:{" "}
          <code>room.created</code>,
          <code> room.updated</code>,
          <code> room.removed</code>,
          <code> member.joined</code>,
          <code> member.left</code>,
          <code> member.ready</code>,
          <code> session.started</code>. Room
          shape:{" "}
          <code>{` { id, name, hostId, members, settings, status } `}</code>.
        </p>
      </section>

      <section>
        <h2>⚡ Performance</h2>
        <p>
          Real-time events batched per RAF tick
          to avoid render flooding. Member list
          re-renders only on changes. Room list
          virtualized when many rooms.
        </p>
      </section>

      <section>
        <h2>🎨 UX</h2>
        <p>
          Room list with filters and sort. Join
          via click. Active room shows members
          prominently with ready indicators
          (green check for ready). Ready toggle
          large and clear. Host controls
          visible only to host. Start button
          dim until conditions met. Settings
          changes reset ready states with an
          announcement.
        </p>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <p>
          Room list accessible. Member list with
          ready states announced. Ready toggle
          is a real button. Host controls
          accessible. State changes (member
          joined, ready toggle, host transfer)
          announce in chunks via polite live
          region.
        </p>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <p>
          Authenticated. Server enforces host
          privileges (kick, settings, start).
          Anti-spam on room creation.
        </p>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <p>
          Integration tests with mock backend:
          create room, join, ready up, start
          session. Host disconnect transfer.
          Reconnect flow. Edge cases for
          settings changes.
        </p>
      </section>

      <section>
        <h2>🚨 Edge Cases</h2>
        <p>
          Host leaves: transfer to next member;
          if no members, close room. Member
          disconnects mid-ready: status changes;
          host can choose to wait or kick.
          Settings change while members ready:
          reset ready (you ready against a
          specific setup). Network drop: try
          reconnect; if fails, navigate to lobby
          list. Room fills mid-join: server
          rejects with reason.
        </p>
      </section>

      <section>
        <h2>🔁 Reusability</h2>
        <p>
          Pattern reuses for any pre-session
          coordination — games, classroom,
          virtual events.
        </p>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <p>
          UI strings via i18n. Player names as
          authored. Room names sanitized.
        </p>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

        <h3>Auto-start vs explicit host start</h3>
        <p>
          Auto-start when all ready feels
          frictionless. Explicit host start gives
          control. We default to host-explicit
          with auto-start option.
        </p>

        <h3>Host transfer vs close on disconnect</h3>
        <p>
          Transfer keeps the lobby alive when
          the host has connection issues. Close
          is simpler. Transfer is right for most
          products.
        </p>

        <h3>Reset ready on settings change</h3>
        <p>
          Reset prevents people committing to
          settings they didn&rsquo;t agree to.
          Don&rsquo;t-reset is more frictionless
          but feels deceptive. Always reset.
        </p>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <p>
          Skill-based matchmaking integration.
          Cross-platform play. Tournament brackets.
          Spectator mode. Voice chat baked in.
        </p>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <p>
          <strong>1. How does the room list update
          in real time?</strong> WebSocket events
          for room.created/updated/removed.
          Subscribers re-render.
        </p>

        <p>
          <strong>2. How is host transfer
          handled?</strong> On host disconnect,
          backend transfers to next member.
          Clients see host change via
          broadcast.
        </p>

        <p>
          <strong>3. When does ready reset?</strong>{" "}
          On settings change (ensures everyone
          ready against current settings). On
          host transfer (new host may want to
          re-confirm).
        </p>

        <p>
          <strong>4. How is the start gated?</strong>{" "}
          Default: host clicks Start when all
          members ready (or override). Server
          validates state at the moment of
          start.
        </p>

        <p>
          <strong>5. How does session handoff
          work?</strong> Host triggers start;
          backend transitions room state;
          members receive session-start event
          and navigate to the session.
        </p>

        <p>
          <strong>6. How does reconnect after a
          drop work?</strong> Try to rejoin the
          room if still available. If gone,
          navigate to lobby list with banner.
        </p>

        <p>
          <strong>7. How does this scale to many
          rooms?</strong> Server-side
          pagination on room list with
          filters. Virtualize the rendered
          list.
        </p>

        <p>
          <strong>8. How is this
          accessible?</strong> Real lists with
          item announcements. Buttons with
          labels. State changes announce in
          chunks via polite live region.
        </p>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <p>
          A multiplayer lobby is{" "}
          <strong>real-time room list + active
          room with members and ready states +
          host controls + session handoff</strong>.
          Host transfer keeps lobbies alive
          through disconnects; ready resets on
          settings changes; explicit start gates
          give the host control. The pattern
          works for games, classrooms, and
          virtual events.
        </p>
      </section>
    </ArticleLayout>
  );
}
