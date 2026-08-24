# The Through-Line, Identity Kit & Image Set

Yuguda Muhammed — Machine Learning Engineer
Live: https://yuguda999.github.io/ys-dev/ · https://yuguda.netlify.app/

---

## 1. The one-line claim

> **I build models that survive production.**

Chosen from ten options I generated, then cut. The runners-up and why they
lost:

- *"Most LLM demos die on contact with real data. I build the ones that
  don't."* — sharper opinion, but it leads with someone else's failure
  instead of my work, and it's two sentences where one will do.
- *"I move LLM systems from 30% right to 90%+ — with a harness that proves
  it."* — carries my hardest number, but welds the whole claim to one
  project's metric. If that number ages, the claim ages with it.

"Survive production" won because it names the actual dividing line in ML
work. Anyone can get a model working in a notebook. The claim is that mine
keep working when real users, messy inputs and concurrency arrive — and
every case study on the site is evidence for exactly that sentence.

**The one action it ladders to:** email me for a technical screening.

---

## 2. Content map

Five pages. Every page ends in the same action.

### Home — `index.html`

| # | Section | Purpose |
|---|---|---|
| 1 | Hero | The claim, in one line, above the fold |
| 2 | Capability marquee | Scannable proof of range |
| 3 | **Selected work** | 6 projects, strongest first |
| 4 | What I do | Three capability groups: LLM & agent systems · Training & evaluation · ML infrastructure |
| 5 | Experience | Lead AI Engineer, and prior roles |
| 6 | More projects | 10 GitHub repos + Project Edix |
| 7 | Contact | **CTA: Email me** |

**Case order in Selected work — deliberate, strongest first:**

1. **Proposal Generation Engine** — in production, client work, and the only
   case with a before/after quality number (30% → 90%+ under an evaluation
   harness). Leads because it is the most senior signal on the site.
2. **FL-04 Orchestrator** — open-weight model served locally; shows I run
   inference myself rather than renting an API.
3. **CampusPQ** — shipped, real users, 5k+ questions at 98%.
4. **DevMemory** — open source, installable from PyPI by anyone.
5. **Eeva** — multimodal, open-weight vision model.
6. **Receipt Classifier** — classical ML, shows the range isn't only LLMs.

### Case pages — `proposal` · `fl04` · `campuspq` · `edix`

All four follow one repeated shape, which is the point:

| # | Section |
|---|---|
| 1 | Back link → Selected work |
| 2 | Title + one-line lede |
| 3 | Facts strip (type · scale · status · stack) |
| 4 | The problem |
| 5 | Approach / The design |
| 6 | Evaluation or Current state — *what came of it* |
| 7 | Stack |
| 8 | Prev / next case |
| 9 | Footer — **CTA: Email me** |

Project Edix is deliberately reachable from *More projects* rather than
Selected work, and says on its own page that it is systems architecture,
not ML. It stays because the reasoning transfers; it does not get promoted
because it would dilute the claim.

### Still need to gather

Honest list, so build week isn't blocked by discovering these late:

| Gap | Which page | Why it matters | Blocker? |
|---|---|---|---|
| No screenshot for **Proposal Engine** — my lead case | `proposal.html` | The strongest case is the only one with no visual proof | Client work; may not be shareable. Need to confirm what I can show — a redacted output, the eval harness table, or an architecture diagram I draw myself |
| No screenshot for **DevMemory** | index card | It's public and installable — a terminal capture of memory written in one AI client and recalled in another would prove the core claim in one image | No — I can capture this today |
| **No photo of me** anywhere | Home / contact | Brief says anything that is *me* should be a real photo, not generated | No — need to take one |
| Eeva + Receipt Classifier have no captures | index cards | Currently text-only cards | No |
| **No numbers** for FL-04 or Edix | those case pages | Both lead on mechanism instead. Honest, but thinner than CampusPQ and Proposal | Needs real measurement, not invention |
| Open Graph share image | all pages | Meta tags for title/description exist; no `og:image` yet, so links unfurl bare | No |

---

## 3. Identity kit

### Type — two fonts, both free on Google Fonts

| Role | Font | Usage |
|---|---|---|
| Headings **and** body | **Inter** | 400 / 500 / 600 / 700. Headings `-0.032em` tracking, `line-height 1.05`; hero pushes to `-0.05em`. Body 16px / 1.6 |
| Labels, metadata, UI | **JetBrains Mono** | 400 / 500 only. Section eyebrows, nav, tags, facts strips. `0.72rem`, `0.14em` tracking, uppercase |

One typeface does the reading. The mono is not decoration — it marks
machine-ish information (labels, counts, statuses) so structure is legible
without adding a third voice.

### Palette — hex codes

**Dark (default)**

| Token | Hex | Role |
|---|---|---|
| `--bg` | `#08090A` | Near-black background |
| `--card` | `#0C0E10` | Raised surface |
| `--ink` | `#F2F4EF` | Near-white primary text |
| `--ink-2` | `#B6BAB2` | Secondary text, hero headline |
| `--muted` | `#82877D` | Mono labels |
| `--accent` | `#BEF264` | The one accent — links, focus rings, brand mark |
| `--line` | `#1D2124` | Hairline borders |

**Light (opt-in via toggle)**

| Token | Hex |
|---|---|
| `--bg` | `#FAFAF7` |
| `--ink` | `#0A0B0C` |
| `--ink-2` | `#3C4046` |
| `--muted` | `#666B63` |
| `--accent` | `#4D7C0F` |

Four colours doing the work: near-black, near-white, one grey, one accent.
The accent is the *only* saturated colour in the entire system.

**Contrast, checked not assumed** (WCAG AA needs 4.5:1 for body text):

| Pair | Ratio | |
|---|---|---|
| `#F2F4EF` on `#08090A` | 17.99 | PASS |
| `#B6BAB2` on `#08090A` | 10.11 | PASS |
| `#BEF264` on `#08090A` | 15.25 | PASS |
| `#0A0B0C` on `#BEF264` (accent buttons) | 15.08 | PASS |
| `#82877D` on `#0C0E10` | 5.26 | PASS |
| `#666B63` on `#FAFAF7` (light) | 5.22 | PASS |

The muted grey **failed before this week** — `#74796F` measured 4.47 on the
background and 4.33 on cards, and the light theme's `#7B8078` was 3.86.
All three are under the 4.5 minimum, and that colour is used for every
section label on the site. Corrected to `#82877D` / `#666B63`, which clear
5.2 with real headroom rather than scraping past at 4.51 — the brief asks
specifically about reading a phone in sunlight, and 4.5 exactly is not a
margin.

### Logo / favicon

A lime chip with lowercase `ym` in JetBrains Mono, `#0A0B0C` on `#BEF264`,
17/64 corner radius. It is the same mark already sitting in the site header
and footer, so the browser tab and the page agree.

Files: `favicon.svg` (scalable), `favicon-32.png`, `favicon-16.png`,
`apple-touch-icon.png` (180), `icon-512.png`, `site.webmanifest`.
Declared on all five pages.

Kept to two letters and one colour on purpose — at 16px anything more
becomes mush, and the recognisable thing at that size is the lime block,
not the letterforms.

### Style note

> **Inter for everything you read, JetBrains Mono for everything you scan.**
> Near-black `#08090A`, near-white `#F2F4EF`, one lime accent `#BEF264`,
> and nothing else saturated.
>
> The mood is *instrument panel* — quiet, dense, technical, with generous
> space and a single bright colour used sparingly enough that it still means
> something. The lime appears on exactly one thing per screen. The work is
> the only place colour is allowed to crowd.

---

## 4. Image set, and what I rejected

### What's on the site

| Image | Page | Type | Why it earns its place |
|---|---|---|---|
| `fl04-vllm-logs.png` | FL-04 | **Real capture** | vLLM serving real completions — proves I run inference locally, which is the whole claim of that case |
| `campuspq-api-docs.png` | CampusPQ | **Real capture** | Live OpenAPI surface — proves the service exists and is deployed |
| `edix-blockchain-identity.png` | Edix | **Real capture** | Wallet on Cardano preprod, honestly labelled as testnet |
| `ym` favicon | all | Made | Two letters, one colour |
| Typographic posters | Proposal, DevMemory cards | Made — CSS, not an image file | See below |

All three work captures are real screenshots, downscaled to ≤1400px and
quantized (741 KB → 348 KB across the set), and each is wrapped in a link so
a phone user can open it full size instead of squinting at a shrunken
1400px capture.

### The rejection note

**I rejected the entire category of AI-generated hero imagery, and never
generated a single one.**

The pull was real — the Proposal Engine is my lead case and it has no
screenshot, so there's an obvious empty slot begging for an abstract
"neural network" render. I didn't fill it, for two reasons.

First, generated abstract art for an ML portfolio is the exact thing a
reviewer has seen a hundred times: the melted glass, the glowing blue
brain, the impossible geometry. It reads as decoration hiding an absence,
and a technical reader clocks it instantly — *if there were a real
screenshot, it would be here*.

Second, and worse: putting a fake picture of a system next to claims about
that system is a credibility trade I'd lose. The whole positioning is "I can
prove it works." A generated image is unprovable by construction.

What went in the empty slots instead: a flat typographic poster — the
project's one-sentence claim in the site's own type, on a single dark tint,
built in CSS with no image file at all. It's honest about being a label
rather than evidence, it costs zero bytes, and it stays consistent because
it's made of the same two fonts and one accent as everything else. An empty
slot handled with type looks deliberate; an empty slot handled with AI slop
looks like it's hiding something.

### One judgment call still open

The hero runs an animated network-graph canvas in the accent colour. It's
procedural, not generated — drawn in `bg.js` — and it disables itself under
`prefers-reduced-motion`. But it is the most eye-catching thing above the
fold, and this week's rule is that the frame must not steal from the
painting. It survives for now because it sits behind the text at low
opacity and reads as a plot rather than an ornament. If a reviewer says it
competes with the work, it goes — that's a one-line change.
