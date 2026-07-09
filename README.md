# Mail Network Simulator

A zero-dependency, browser-native simulation of a client/server mail (packet-delivery) network, built entirely with vanilla **JavaScript (ES Modules + Web Components)**, **HTML**, and **CSS** — no frameworks, no bundler, no build step.

It models core computer-networking concepts visually:

- **Clients** as network hosts, each with its own address
- A central **Server** that routes messages between clients
- **Cables** as point-to-point links with a busy/free state (half-duplex — one package in flight at a time)
- **Packages** as the unit of data transmitted between a client and the server
- **Storage** buffers on both the client and server side, used as FIFO queues when a link is occupied
- Animated envelope graphics that travel across the cable to visualize transmission latency

## Live concepts demonstrated

| Concept | How it's modeled |
|---|---|
| Addressing | Each client gets an auto-incrementing numeric address (`_address`) used to route packages |
| Packet switching | The `Server` inspects each package's `addressee` and forwards it to the matching client's cable |
| Link contention | A `Cable` exposes a `state` (`free` / `caught`); if busy, new packages are queued instead of sent immediately |
| Queuing / buffering | `Storage` elements hold pending packages per-client and on the server, draining via `take()` once a cable frees up |
| Latency / propagation delay | `Cable.animate()` moves an envelope across the screen over a fixed delay before delivery completes |
| Broadcast | "Send To All" dispatches one package per registered client entry |
| Error handling | If a package's destination cable no longer exists, the server bounces it back with `sender = 'server-error'` and the receiving client discards the stale copy |
| Message history | Every client keeps `previously_sent_messages` / `previously_received_messages`, viewable per-client in an inbox/outbox screen |

## Project structure

```
.
├── index.html              # App shell: server area, client dock, action buttons
├── css/
│   ├── index.css            # Page layout
│   ├── elements.css         # Styles for custom elements (client, cable, storage, package)
│   └── messages.css         # Inbox/outbox (message viewer) styles
├── js/
│   ├── start.js             # Entry point: bootstraps the server and initial clients
│   └── classes/
│       ├── server.js        # <mail-server>  — routing, broadcast, scheduled messages
│       ├── client.js        # Client         — base class: address, message history
│       ├── client_text.js   # <mail-client>  — UI-bound client (form, storage, cable)
│       ├── cable.js         # <mail-cable>   — link state + transmission animation
│       ├── package.js       # <mail-package> — a single message/packet in transit
│       ├── storage.js       # <mail-storage> — FIFO buffer for queued packages
│       └── messages.js      # <mail-messages> — inbox/outbox view for a client
├── media/images/            # Envelope icon assets
└── fonts/                   # Local webfonts
```

All classes are registered as native [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements) (`mail-server`, `mail-client`, `mail-cable`, `mail-package`, `mail-storage`, `mail-messages`) and use Shadow DOM for style/markup encapsulation.

## Getting started

No installation or build step is required — this is a static site.

```bash
# Option 1: open directly
open index.html          # macOS
start index.html         # Windows

# Option 2 (recommended): serve it, since ES modules require http(s), not file://
npx serve .
# or
python -m http.server 8000
```

Then visit the served URL in a modern browser (one that supports Custom Elements, Shadow DOM, and ES Modules — any current Chrome/Edge/Firefox/Safari).

## Using the simulator

1. On load, a server and **3 clients** are created automatically.
2. **Add Client** — spins up a new client with its own cable and server-side storage buffer.
3. Click a client to open its message form, then fill in an **Addressee** (a client's numeric address) and a **Message**, and hit **Send**.
4. Watch the envelope animate along the cable to the server, then out along the destination cable to the recipient.
5. **Send To All** — broadcasts one message to every registered client.
6. **Scheduled Message** — sends a random message from the server to a randomly chosen client.
7. Click a client's message counter to open its **inbox/outbox** and review message history.
8. If a link is busy when a package arrives, it queues in that client's/server's storage and is automatically drained once the link frees up.
9. If a destination no longer exists, the package is bounced back to the sender with an error notice, visible in its outbox.

## Design notes

- **No external dependencies** — everything runs on native browser APIs (`customElements`, Shadow DOM, `<template>`, `history.pushState` for view navigation).
- **State lives on the elements themselves** — each custom element instance owns its relevant network state (address, queue, link state), mirroring how real network nodes are independently stateful.
- **Timing is simulated with `setTimeout`/`setInterval`** to represent transmission delay and to keep the "one package per link at a time" invariant.

## Possible next steps

- Add a `package.json` + linter/formatter for consistent tooling.
- Extract magic numbers (10000ms transmission delay, animation frame timing) into named constants/config.
- Add automated tests around routing, queuing, and the error-bounce path.
- Improve accessibility (keyboard navigation, ARIA labels) for the client/message UI.
