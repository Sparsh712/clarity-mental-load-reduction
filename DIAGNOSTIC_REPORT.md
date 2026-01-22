# Diagnostic Report – Clarity Mental‑Load Reduction Prototype

---

## 1. Problem Breakdown

**Mental load** is the cumulative cognitive effort required to keep track of, prioritize, and act on a flood of daily notifications (email, Slack, calendar, social, app alerts).  

- **Information overload** – users receive 30‑50+ notifications per day, many of which are low‑value or redundant.
- **Context‑blindness** – traditional notification systems do not adapt to the user’s current focus (deep work, meetings, breaks).
- **Decision fatigue** – each notification forces a micro‑decision (read, ignore, act), draining mental resources and reducing productivity.
- **Impact** – research shows that high mental load reduces task performance by up to 30 % and increases stress levels.

**Clarity** addresses this by filtering and routing notifications based on real‑time context and an AI‑driven urgency model, surfacing only the most critical items.

---

## 2. Product Design

### 2.1 User Flows
1. **Landing / Hero** – user sees a clean dashboard with three columns: *Incoming*, *Urgent*, *Deferred*.
2. **Demo Email Mode** – click **📧 Demo Emails** → 10 realistic sample emails are generated and flow through the system.
3. **Real Gmail Integration** – optional login via OAuth → fetch latest inbox emails → classification.
4. **Interaction** – click a badge on a notification to view details, dismiss, or mark as done; the system updates statistics in real time.

### 2.2 Wireframes / Prototype
- **Hero Section** – large title, brief description, two buttons (Demo Email Mode, Login with Gmail).
- **Notification Columns** – each column scrollable, with subtle micro‑animations as items move between columns.
- **Stats Panel** – shows blocked count, focus time, decisions handled.
- **Context Indicator** – top‑right shows current mode (Deep Focus, In‑Meeting, Available).

> **Note:** The prototype lives in `index.html` + `app.js` + `styles.css`.  All UI components are pure HTML/CSS/JS – no framework required, making the demo instantly runnable in any browser.

---

## 3. Logic & Intelligence Layer

### 3.1 Classification Engine
- **Input** – notification object (`type`, `sender`, `content`, `urgencyScore`).
- **Context Detector** – infers current mode from time‑of‑day (simple heuristic) and could be extended to read calendar events.
- **Urgency Scoring** – base score 0.3 for any email; adds:
  - `+0.3` if marked important (`isImportant`)
  - `+0.2` if unread (`isUnread`)
  - `+0.3` for urgent keywords in subject (`urgent`, `asap`, `critical`, …)
  - `‑0.3` for automated senders (`noreply`).
- **Decision Rule** – if `urgencyScore >= context.threshold` → **Urgent** column, else → **Deferred**.

### 3.2 Absorbing Decisions
- **Moving items** – notifications animate out of *Incoming* and appear in the appropriate column, removing the need for the user to manually triage each one.
- **Statistics** – every deferred item increments a *blocked* counter, giving a quantitative view of mental load saved.
- **Extensibility** – the same engine can be hooked to other sources (Slack, calendar) by providing a compatible object shape.

---

## 4. Validation Plan

| Phase | Goal | Method | Success Metric |
|------|------|--------|----------------|
| **1 – Lab Demo** | Verify classification logic works on synthetic data. | Run the Demo Email Mode, record classification distribution. | ≥ 80 % of *Urgent* emails contain at least one urgency keyword. |
| **2 – Controlled User Study** | Measure mental‑load reduction. | 12 participants perform a 30‑min focus task with and without Clarity. | **NASA‑TLX** score reduced by ≥ 20 % in the Clarity condition. |
| **3 – Field Pilot** | Real‑world impact on email overload. | Deploy to 5 power‑users for 2 weeks; collect logs of notifications processed. | Average daily *blocked* count ≥ 15 and self‑reported productivity increase ≥ 10 %. |
| **4 – A/B Test** | Compare against baseline inbox view. | Randomly assign users to Clarity vs. native Gmail view. | Click‑through rate on urgent items ↑ 25 % and overall time‑on‑task ↓ 15 %. |

**Data Collection** – the prototype logs each notification’s raw data, classification, and timestamp to the browser console (can be sent to a backend for deeper analysis).  All logs are anonymized; no email content is stored on the server.

---

## 5. How to Export to PDF
1. Open `DIAGNOSTIC_REPORT.md` in any markdown editor (VS Code, Typora, Obsidian).
2. Use the editor’s **Export → PDF** function.  The default styling will produce a clean 3‑5‑page PDF.
3. If you prefer command‑line conversion, install `pandoc` and run:
   ```bash
   pandoc DIAGNOSTIC_REPORT.md -V geometry:margin=1in -o DIAGNOSTIC_REPORT.pdf
   ```
   This will generate a printable PDF with proper page breaks.

---

*Prepared for the IITR Productathon submission – “Clarity: AI‑Powered Notification Manager”.*
