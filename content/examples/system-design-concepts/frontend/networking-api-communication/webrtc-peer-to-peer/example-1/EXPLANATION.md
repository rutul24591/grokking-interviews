This app now performs a real local peer negotiation in the browser.

- Two `RTCPeerConnection` instances are created on the same page.
- A Node signaling API stores offers, answers, and ICE candidates.
- The peers exchange signaling messages through the API, open a real data channel, and send a message peer-to-peer.

That makes the example a true end-to-end WebRTC setup instead of a static negotiation timeline.
