"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-multiplayer-game-lobby-matchmaking",
  title: "Design a Real-Time Multiplayer Game Lobby & Matchmaking UI",
  description:
    "Architecture for a game lobby and matchmaking system: skill-based matching, lobby state machine, WebSocket sync, anti-cheat, and queue management at scale.",
  category: "high-level-design",
  subcategory: "realtime-collaboration-systems",
  slug: "real-time-multiplayer-game-lobby-and-matchmaking-ui",
  wordCount: 5400,
  readingTime: 33,
  lastUpdated: "2026-05-10",
  tags: ["hld", "game-lobby", "matchmaking", "skill-rating", "WebSocket", "state-machine"],
  relatedTopics: ["presence-system", "real-time-collaborative-whiteboard"],
};

export default function MultiplayerGameLobbyMatchmakingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>A multiplayer game lobby and matchmaking system solves the coordination problem between players who want to play together: finding compatible opponents (similar skill level, preferred game mode, low network latency between them), holding them in a lobby while others join, synchronizing the lobby state (who has readied up, who left, when the game starts), and launching the game session. The matchmaking system is the gateway to the game; if it is slow, opaque, or unfair, players abandon the queue.</p>
        <p>The UI component is more sophisticated than it appears: the lobby must update in real-time as players ready up, leave, or are replaced by the matchmaking system. The matchmaking queue must show estimated wait time (accurately, or players abandon), progress indicators, and alternative options when wait time is too long (expand skill bracket, try a different mode). The match start sequence must be coordinated precisely—all players must receive the server address and launch the game within a tight window, or the match falls apart.</p>
        <p><strong>Explicit assumptions:</strong> The game is a team-based competitive game (5v5). Matchmaking uses Elo/MMR-based skill rating. Lobby sizes are exactly 10 players (two teams of 5). Players can queue solo (individual matchmaking) or as a party (pre-formed group, matched as a unit). A match has a 30-second accept/decline window; if any player declines or does not respond, the match is cancelled and affected players re-queue. The game server is provisioned on-demand (cloud gaming infrastructure); the matchmaking service triggers server provisioning.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Queue entry:</strong> Player selects game mode, enters the matchmaking queue. Solo and party queue supported. Queue position and estimated wait time displayed in real-time.</li>
          <li><strong>Skill-based matching:</strong> Match players with similar MMR (Matchmaking Rating). Acceptable MMR range expands as wait time increases (bracket expansion).</li>
          <li><strong>Match acceptance:</strong> When a match is found, all 10 players are notified simultaneously with a 30-second window to accept or decline. Declined match re-queues accepting players.</li>
          <li><strong>Lobby state:</strong> After acceptance, players see the lobby: team assignments, player names, MMR ranges, ping estimates, and ready/not-ready status. Match starts when all 10 are ready.</li>
          <li><strong>Party system:</strong> Players can form parties before queuing. The party leader controls queue entry. Party members see the queue state in real-time.</li>
          <li><strong>Dodge penalty:</strong> Players who decline matches or fail to accept within the window receive a cooldown penalty before re-queuing.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Match quality:</strong> Average MMR spread within a match should be under 200 points (comparable skill). Accept queue-time trade-off: higher spread acceptable after 5+ minutes of waiting.</li>
          <li><strong>Wait time accuracy:</strong> Estimated wait time displayed to the player should be within 30% of the actual wait time at the time of display.</li>
          <li><strong>Accept window reliability:</strong> All 10 players must receive the match notification within 1 second of each other. Late notifications cause unfair time pressure.</li>
          <li><strong>Scale:</strong> Handle 100,000 concurrent players in queue across all game modes.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The system has four components: the Queue Service (accepts players into the queue, maintains the queued player set, exposes queue state via WebSocket), the Matchmaking Engine (periodically runs the matching algorithm, finds compatible groups of 10 players, triggers match creation), the Lobby Service (manages the lobby state for a created match: player acceptance, ready state, team assignment, match start), and the Game Server Provisioner (allocates a game server instance for an accepted match). Players communicate with all services via a WebSocket connection that is established on queue entry and maintained through the lobby phase.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/realtime-collaboration-systems/real-time-multiplayer-game-lobby-and-matchmaking-ui-architecture.svg"
          alt="Game lobby matchmaking architecture showing Queue Service (player entry, MMR storage, wait time estimation), Matchmaking Engine (periodic sweep, MMR bracket matching, bracket expansion over time), Lobby Service (10-player WebSocket room, accept/decline state machine, ready-up tracking, match start trigger), Game Server Provisioner (cloud instance allocation), and party management side-channel."
          caption="Matchmaking architecture: Queue Service → Matchmaking Engine → Lobby Service → Game Server Provisioner, with WebSocket real-time lobby state"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Matchmaking Algorithm and Bracket Expansion</h3>
        <p>The matchmaking engine runs a sweep every 2–5 seconds across all queued players. The primary matching criterion is MMR proximity: players within ±100 MMR of each other are ideal matches. The engine groups players into potential teams using a bipartite matching algorithm: find 10 players such that (a) the two teams of 5 have similar average MMR, (b) the overall MMR spread within each team is minimal, and (c) network latency between all players is acceptable (measured by geolocation or latency probes). The optimal grouping is NP-hard for large player sets; practical implementations use greedy algorithms with local optimization (find a near-optimal grouping in O(N log N) rather than exhaustive search).</p>
        <p>Bracket expansion prevents players from waiting indefinitely for a perfect match. The acceptable MMR range expands as a function of wait time: after 30 seconds in queue, ±150 MMR; after 2 minutes, ±250 MMR; after 5 minutes, ±400 MMR; after 10 minutes, any MMR. The expansion is exponential (each minute roughly doubles the acceptable spread). The current bracket is displayed to the player ("Searching within ±150 MMR") and updates live as wait time increases. This transparency helps players understand why they might be matched with higher or lower MMR opponents after long waits.</p>
        <p>Party handling: a party of 3 players queuing together is matched as a unit with 7 individual players. The party's average MMR determines their bracket position. To ensure fair team composition, the matchmaking engine applies a "party penalty": parties of 3+ players on the same team are matched against similar-sized parties on the opposing team, rather than 5 solo players (who lack coordination advantages). This prevents the unfair scenario of a 5-player party (with full coordination) being matched against 5 solo players.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Queue State Machine</h3>
        <p>The player's queue state follows a defined state machine: idle → queuing (player in queue, waiting for match) → match_found (match has been found, 30-second accept window active) → accepting (player accepted, waiting for others) → lobby (all players accepted, in pre-game lobby) → in_game (game launched) → post_game (game ended, back to idle). Each state has a corresponding UI: idle shows the queue entry screen; queuing shows the estimated wait time and an animated queue indicator; match_found shows the match accept screen with a 30-second countdown; lobby shows the team composition, player cards, and ready-up controls.</p>
        <p>State transitions are server-authoritative (the server sends WebSocket events that transition the client's state) not client-triggered. The client cannot self-declare that it is in_game; only the server's game_started event moves the player to that state. This prevents clients from bypassing the state machine (e.g., forcing a match start before all players are ready). The client's state machine is a local replica of the server's authoritative state, updated via WebSocket events.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Match Accept Window and Reliability</h3>
        <p>When the matchmaking engine identifies a valid group of 10 players, it creates a pending match record and sends a match_found WebSocket event to all 10 players simultaneously. The simultaneous delivery is critical for fairness: if some players receive the notification 5 seconds after others, they have less time to accept. The WebSocket server delivers events to all connected clients in a lobby room as a batch operation; the delivery is bounded by the WebSocket server's broadcast latency (typically under 100ms for all clients in the same data center region).</p>
        <p>The accept window countdown (30 seconds) is driven by the server's authoritative timer, not the client's local clock. The server sends periodic tick events (every 1 second) with the remaining time; the client displays the countdown based on these server ticks. This ensures all clients display the same remaining time, even if their local clocks are skewed. When the countdown reaches zero, the server evaluates accept/decline status: if all 10 accepted, the match proceeds; if any player declined or timed out, the match is cancelled, the declining player receives a dodge penalty (a 5-minute queue cooldown), and the other 9 players are returned to the front of the queue (they skip the queue; their wait time does not increase).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Lobby State Synchronization</h3>
        <p>The lobby is a WebSocket room with exactly 10 players. The Lobby Service maintains the authoritative lobby state: (matchId, players: [{userId, teamId, mmr, ready: bool, pingMs: number}], startCountdown: null | number). When any player's state changes (toggles ready, disconnects), the Lobby Service broadcasts the full lobby state to all connected players. Broadcasting the full state (not a delta) is correct for a 10-player room: the state is small (~2KB), and full-state broadcasts avoid the ordering complexity of delta-based sync.</p>
        <p>The match starts when all 10 players are in the ready state. The Lobby Service begins a 5-second countdown (sent to all players via WebSocket) during which any player can un-ready (cancelling the countdown and requiring all to re-ready). After the countdown completes, the Lobby Service triggers the Game Server Provisioner, which allocates a game server and returns its IP address and port. The Lobby Service sends a game_starting event to all 10 players containing the server address. Players' game clients connect directly to the game server. The WebSocket lobby connection is closed.</p>
        <p>Disconnect handling in the lobby: if a player disconnects from the WebSocket during the lobby phase (network drop, browser close), the Lobby Service marks them as disconnected and broadcasts the update. The player has 60 seconds to reconnect and rejoin the lobby. During this window, the match is held (the countdown does not start). If they do not reconnect within 60 seconds, they are removed from the match (treated as a decline, subject to dodge penalty), the match is cancelled, and the remaining 9 players are returned to the queue. This reconnection grace period handles the common case of accidental disconnection without penalizing players.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Wait Time Estimation</h3>
        <p>Accurate wait time estimation is important for user retention: players who see "2 minutes" and wait 10 minutes feel deceived and abandon the queue. Estimation is based on a rolling average of recent successful match times for players with similar MMR and party composition in the same game mode. The Queue Service maintains a time-series of recent match durations (last 1000 matches per mode/MMR bracket combination, stored in Redis). The estimate is the 75th percentile of this distribution (not the average—the distribution is right-skewed by occasional long waits, and the 75th percentile more closely matches the user's expectation: "you will wait this long or less, 75% of the time").</p>
        <p>The estimate is recalculated every 30 seconds and pushed to the queued player's WebSocket connection. If the actual wait exceeds the estimate by more than 50%, the system proactively notifies the player: "Wait time is longer than expected. Expanding your search..." and displays the expanded bracket. This transparency reduces abandon rates compared to unexplained extended wait times.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/realtime-collaboration-systems/real-time-multiplayer-game-lobby-and-matchmaking-ui-workflow.svg"
          alt="Matchmaking workflow showing player queue entry → MMR bracket assignment → periodic sweep (every 5s) → 10-player group formation → simultaneous match_found broadcast → 30s accept window (server-authoritative timer) → all-accept → lobby formation → ready-up synchronization → game server provisioning → game_starting broadcast. Decline path: dodge penalty + 9 players return to front of queue."
          caption="Matchmaking flow: queue entry → periodic sweep → simultaneous match broadcast → accept window → lobby ready-up → game server provisioning"
        />
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>Match quality versus wait time: tighter MMR brackets produce better match quality (more balanced games) but longer wait times (fewer compatible players available at any moment). The bracket expansion algorithm is the key tuning lever. The optimal expansion rate is a function of the player population size in a given MMR tier: high-population tiers (average MMR, largest player count) can maintain tight brackets even with long waits; low-population tiers (very high or very low MMR, small player count) must expand aggressively or players in those tiers will never find matches. Different MMR tiers can have different expansion curves, optimized for their population density.</p>
        <p>Centralized versus regional matchmaking: a global matchmaking pool maximizes player population (better match quality for all tiers) but risks matching players with high latency between them (a player in Tokyo matched with a player in New York on a game server in Virginia). Regional matchmaking pools reduce cross-region latency but fragment the player population (low-population tiers have even fewer players to match against). The common solution: prefer same-region matches but allow cross-region matching for high-MMR tiers where population is thin, with a latency penalty in the match quality score (a match is only accepted cross-region if the MMR quality gain outweighs the latency penalty).</p>
        <p>Server provisioning latency: on-demand game server provisioning (allocating a cloud VM, starting the game server process, and reporting the server address) typically takes 30–90 seconds on AWS/GCP. This is too long to make players wait in the lobby after accepting. The solution is pre-provisioned warm server pools: the Game Server Provisioner maintains a pool of pre-started game servers (idle, waiting for assignment). When a match is accepted, the Provisioner assigns the match to a warm server (near-instant) rather than provisioning a new one. Warm servers are replenished by the provisioner as they are consumed, maintaining the pool at a target size based on current queue depth. Pool sizing is a cost optimization: more warm servers means faster match start but higher idle compute cost.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A multiplayer game lobby and matchmaking system coordinates player acquisition, skill-based grouping, acceptance, and game server handoff through a series of state machine transitions driven by WebSocket events. The matchmaking engine runs periodic sweeps (every 2–5 seconds) applying MMR-based bipartite matching with time-based bracket expansion. Match found events are delivered simultaneously to all 10 players; the 30-second accept window uses a server-authoritative timer broadcast via WebSocket ticks. The lobby state is synchronized as full-state broadcasts (not deltas) to all 10 players in a dedicated WebSocket room. Wait time estimates use the 75th percentile of recent match times per bracket, updated every 30 seconds with proactive notification when expectations are exceeded. Game servers are provisioned from a pre-warmed pool for near-instant match launch. The fundamental tuning challenge is the match quality versus wait time trade-off, which the bracket expansion algorithm handles per MMR tier and per region based on population density.</p>
      </section>
    </ArticleLayout>
  );
}
