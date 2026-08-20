# ys-dev — portfolio

Static portfolio for Yuguda Muhammed, positioned as a **machine learning engineer**.
Dark by default; light theme is an explicit opt-in stored in `localStorage`.
Every animation is gated behind `prefers-reduced-motion`.
No framework, no build step. Open `index.html` or serve the folder.

    python3 -m http.server 8000

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Home — hero, selected work, stats, capabilities, experience, all projects |
| `proposal.html` | Case study — Proposal Generation Engine (production LLM reasoning system) |
| `fl04.html` | Case study — FL-04 Orchestrator |
| `campuspq.html` | Case study — CampusPQ multimodal platform |
| `edix.html` | Case study — Project Edix (systems work, flagged as non-ML) |
| `style.css` | Design system — light/dark tokens, all layout |
| `app.js` | Theme toggle, ⌘K palette, scroll reveals, stat counters |
| `bg.js`  | Hero canvas — live feed-forward network (nodes hold activations, edges hold weights, dots are a forward pass) |
| `images/` | Case study screenshots |

Case-study pages are generated from shared nav/footer partials by hand-editing;
if you add a page, copy the header and footer blocks from an existing one.
