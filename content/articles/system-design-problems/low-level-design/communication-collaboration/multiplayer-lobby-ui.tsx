"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
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
        <HighlightBlock as="p" tier="important">
          We are designing a multiplayer lobby —
          the UI where users gather before a game
          (or shared session) starts. Users see
          available rooms, join one, see other
          members, mark themselves ready, and the
          host starts the session. Lobbies appear
          in games, online classroom tools,
          virtual events, and any shared session
          with a coordinated start.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          The hard problems are: real-time room
          membership updates (people joining and
          leaving); ready states with host
          coordination (start when all ready);
          host controls (kick, change settings);
          handoff to the actual session/game on
          start; reconnection if a member drops;
          accessibility for the lobby UI.
        </HighlightBlock>

        <h3>User Context</h3>
        <HighlightBlock as="p" tier="important">
          End users join lobbies to play or
          collaborate. They expect to see who&rsquo;s
          in the room, mark themselves ready, and
          have the host start. Engineering teams
          provide a lobby backend (typically
          WebSocket-based) and the runtime
          handles UI.
        </HighlightBlock>

        <h3>Assumptions</h3>
        <HighlightBlock as="p" tier="important">
          Backend exposes WebSocket events for
          room membership, ready state changes,
          host actions. Authentication identifies
          users.
        </HighlightBlock>

        <h3>Non-Goals</h3>
        <HighlightBlock as="p" tier="important">
          The actual game/session, matchmaking
          algorithms (the lobby&rsquo;s job is
          coordination, not selection), voice
          chat (typically separate).
        </HighlightBlock>
      </section>

      <section>
        <h2>⚙️ Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <HighlightBlock as="p" tier="crucial">
          Room list (browse available rooms with
          name, member count, status). Create
          room. Join room. Leave room. Member
          list per room with ready state. Ready
          toggle for self. Host controls: kick,
          change settings, start. Start gates on
          all-ready (or host-override). Real-time
          updates as members join/leave/toggle
          ready. Handoff to session on start.
        </HighlightBlock>

        <h3>Secondary (Nice-to-have)</h3>
        <HighlightBlock as="p" tier="important">
          Room chat. Voice chat integration.
          Spectator mode. Custom room settings
          (game mode, map, etc.). Skill-based
          matchmaking (auto-join). Friends-only
          rooms. Region selection. Anti-griefing
          (minimum ready time, vote-kick).
        </HighlightBlock>

        <h3>Out of Scope</h3>
        <HighlightBlock as="p" tier="important">
          The session itself, voice chat
          backend, matchmaking algorithms.
        </HighlightBlock>
      </section>

      <section>
        <h2>📊 Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <HighlightBlock as="p" tier="crucial">
          Membership updates within ~100 ms. Room
          list updates smooth even with many
          rooms (virtualize if needed).
        </HighlightBlock>

        <h3>Reliability</h3>
        <HighlightBlock as="p" tier="important">
          Reconnection re-joins room if still
          available. Host disconnect transfers
          host (or closes room). Stale rooms
          time out.
        </HighlightBlock>

        <h3>Security</h3>
        <HighlightBlock as="p" tier="important">
          Authenticated WebSocket. Server enforces
          host privileges. Anti-spam on room
          creation.
        </HighlightBlock>

        <h3>Accessibility</h3>
        <HighlightBlock as="p" tier="important">
          Room list as a navigable list. Member
          list accessible. Ready toggle is a real
          button. State changes announce.
        </HighlightBlock>

        <h3>Maintainability</h3>
        <HighlightBlock as="p" tier="important">
          Lobby state in a small store. Settings
          schema declarative. Plugins for chat,
          voice.
        </HighlightBlock>
      </section>

      <section>
        <h2>🧠 Solution Approach</h2>
        <HighlightBlock as="p" tier="crucial">
          The lobby has three planes: <strong>room
          list</strong> (browse + create + join),
          <strong> active room</strong> (members,
          ready, settings, host controls), and
          <strong> handoff</strong> (transition
          to the session on start). Real-time via
          WebSocket; reconnection logic from the
          presence subsystem.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The <strong>room list</strong> subscribes
          to a stream of room updates. New rooms
          appear; full or started rooms drop.
          User clicks to join. Filtering and
          sorting by criteria (player count,
          mode, region).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The <strong>active room</strong> view
          subscribes to that room&rsquo;s
          membership and state. Members render
          with ready indicators. The current user
          can toggle their ready state. Host
          sees additional controls.
        </HighlightBlock>
        <p>
          On <strong>join</strong>: send join
          request to backend. Server validates
          (capacity, permissions) and adds the
          user. Other members&rsquo; UIs update
          via WebSocket broadcast.
        </p>
        <HighlightBlock as="p" tier="important">
          On <strong>ready toggle</strong>: send
          ready event. Server updates state.
          Other members see updated indicator.
          When all members are ready (or host
          overrides), the host&rsquo;s Start
          button enables.
        </HighlightBlock>
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
        <HighlightBlock as="p" tier="important">
          <strong>Settings changes</strong>: host
          changes settings (e.g. map, game mode);
          server validates and broadcasts. All
          members see the new settings; ready
          state may reset (you ready up against
          specific settings).
        </HighlightBlock>
      </section>

      <section>
        <h2>🧱 Component Architecture</h2>
        <HighlightBlock as="p" tier="crucial"><strong>LobbyProvider</strong>{" "}
          instantiates backend connection.
          <strong> RoomList</strong> renders</HighlightBlock>
<HighlightBlock as="p" tier="important">available rooms. <strong>RoomCard</strong>{" "}
          renders one room. <strong>ActiveRoom</strong>{" "}
          renders the joined room.</HighlightBlock>
<HighlightBlock as="p" tier="important"><strong> MemberList</strong> renders
          members with ready states.
          <strong> ReadyToggle</strong> for self.
          <strong> HostControls</strong> for
          host. <strong>SettingsPanel</strong>{" "}
          for room settings.</HighlightBlock>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Room list, active room state,
          <Highlight tier="important">membership, ready states in external
          store.</Highlight> Connection state in connection
          store.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Events:{" "}
          <code>room.created</code>,
          </Highlight><code> room.updated</code>,
          <code> room.removed</code>,
          <code> member.joined</code>,
          <code> member.left</code>,
          <code> member.ready</code>,
          <code> session.started</code>. Room
          shape:{" "}
          <Highlight tier="important">
            <code>{` { id, name, hostId, members, settings, status } `}</code>
          </Highlight>
          .
        </HighlightBlock>
      </section>

      <section>
        <h2>⚡ Performance</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Real-time events batched per RAF tick
          to avoid <Highlight tier="important">render flooding. Member list
          re-renders only</Highlight> on changes. Room list
          virtualized when many rooms.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🎨 UX</h2>
        <HighlightBlock as="p" tier="crucial"><Highlight tier="important">Host controls
          visible only to host. Start button
          dim until conditions</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">met. Settings
          changes reset ready states with an
          announcement.</HighlightBlock>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <HighlightBlock as="p" tier="crucial">Room list accessible. Member list with
          ready states announced. Ready toggle
          is a real button. Host controls
          accessible.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">State changes (member
          joined, ready toggle, host transfer)
          announce in chunks via polite live
          region.</Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Authenticated. Server enforces <Highlight tier="important">host
          privileges (kick, settings, start).
          Anti-spam</Highlight> on room creation.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Integration tests with mock backend:
          create room, join, <Highlight tier="important">ready up, start
          session. Host disconnect</Highlight> transfer.
          Reconnect flow. Edge cases for
          settings changes.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🚨 Edge Cases</h2>
        <HighlightBlock as="p" tier="crucial">Settings change while members ready:
          reset ready (you ready against a
          specific setup). Network drop: try</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">reconnect; if fails, navigate to lobby
          list. Room fills mid-join: server
          rejects with reason.</Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🔁 Reusability</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Pattern reuses <Highlight tier="important">for any pre-session
          coordination — games,</Highlight> classroom,
          virtual events.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          UI strings <Highlight tier="important">via i18n. Player names as
          authored.</Highlight> Room names sanitized.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

        <h3>Auto-start vs explicit host start</h3>
        <HighlightBlock as="p" tier="crucial">
          Auto-start when all ready feels
          frictionless. Explicit host start gives
          control. We default to host-explicit
          with auto-start option.
        </HighlightBlock>

        <h3>Host transfer vs close on disconnect</h3>
        <HighlightBlock as="p" tier="important">
          Transfer keeps the lobby alive when
          the host has connection issues. Close
          is simpler. Transfer is right for most
          products.
        </HighlightBlock>

        <h3>Reset ready on settings change</h3>
        <HighlightBlock as="p" tier="important">
          Reset prevents people committing to
          settings they didn&rsquo;t agree to.
          Don&rsquo;t-reset is more frictionless
          but feels deceptive. Always reset.
        </HighlightBlock>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Skill-based matchmaking integration.
          <Highlight tier="important">Cross-platform play. Tournament brackets.
          Spectator mode.</Highlight> Voice chat baked in.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <HighlightBlock as="p" tier="important">
          <strong>1. How does the room list update
          in real time?</strong> WebSocket events
          for room.created/updated/removed.
          Subscribers re-render.
        </HighlightBlock>

        <HighlightBlock as="p" tier="important">
          <strong>2. How is host transfer
          handled?</strong> On host disconnect,
          backend transfers to next member.
          Clients see host change via
          broadcast.
        </HighlightBlock>

        <HighlightBlock as="p" tier="important">
          <strong>3. When does ready reset?</strong>{" "}
          On settings change (ensures everyone
          ready against current settings). On
          host transfer (new host may want to
          re-confirm).
        </HighlightBlock>

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

        <HighlightBlock as="p" tier="crucial">
          <strong>7. How does this scale to many
          rooms?</strong> Server-side
          pagination on room list with
          filters. Virtualize the rendered
          list.
        </HighlightBlock>

        <HighlightBlock as="p" tier="important">
          <strong>8. How is this
          accessible?</strong> Real lists with
          item announcements. Buttons with
          labels. State changes announce in
          chunks via polite live region.
        </HighlightBlock>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="important">Host transfer keeps lobbies alive
          through disconnects; ready resets on
          settings changes; explicit start</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="crucial">gates
          give the host control. The pattern
          works for games, classrooms, and
          virtual events.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
