Video Script: Cubelelo Support Insights Tool
Total Estimated Time: 4 Minutes

1. Introduction (30 Seconds)
"Hello, I’m Mandeep Singh, and I’m excited to present my prototype for the AI Tools & Internal Operations Intern role at Cubelelo.
The goal of this project is to build a tool that turns messy support CSV data into a concise, actionable manager dashboard in under 30 seconds. I implemented this in React + TypeScript with Tailwind CSS and OpenRouter AI.

2. The Core Problem & Use Cases (45 Seconds)
"Managers struggle with noisy ticket logs and inconsistent schema, which hides delivery delays, refunds, and quality issues.
This app addresses four use cases:
- Weekly Triage: auto-detect top issue categories and anomaly signals.
- Stuck Tickets: surface unresolved tickets (status Open / In Progress) and a concrete reason.
- Trends: find top problem products and recurring category patterns.
- Rapid Summary: generate a 5-line executive summary plus AI-suggested patterns.

3. Demo of the Solution (1.5 Minutes)
(Action: start screen share on the landing page.)
"Upload a support ticket CSV into the File Upload card. The parser handles noisy headers ('Ticket ID', 'ticketid', 'id', etc.), quoted data, and inconsistent fields.
The interface saves parsed data and analysis in localStorage so a refresh keeps context.

Dashboard:
- Overview has Executive Summary (AI response parsed from JSON) and quick stats from local logic.
- Deep Dive has category charts + product analysis + top issue cards.
- Bottlenecks shows unresolved tickets with reasons computed locally by `getStuckReason()` (refund, replacement, delivery, damaged, high priority, etc.) and `daysSinceUpdate` from `lastUpdatedDate`.
- Action Plan combines high-severity categories, overdue tickets (>7 days), and AI extracted patterns into prioritized tasks.

4. Key Decisions & Architecture (45 Seconds)
"Hybrid intelligence:
- local processing in `OpenRouterService`: normalize status/category, find unresolved tickets, compute top issue categories with severity (low/medium/high/critical), and stuck reason heuristics.
- one optimized prompt sent to OpenRouter (`openrouter/auto`) with compact ticket summary and JSON output request.

Data normalization:
- `normalizeCategory`, `normalizeStatus`, and flexible date parsing (`parseDate`) ensure robustness for messy CSVs.
- `mergeCategory()` groups related categories (Delivery/Shipping, Quality/Defect, Wrong/Missing).

API robustness:
- If OpenRouter returns markdown-wrapped JSON, the parser strips code fences and parses the object safely.
- UI feedback states: idle/loading/success/error are handled via `useGeminiAnalysis` and `useCsvParser`.

5. Challenges Faced (30 Seconds)
"Challenges addressed:
- Unresolved logic is status-driven (Open/In Progress), not just stale age, with `daysSinceUpdate` used for escalation.
- AI JSON parsing (enhanced with `.trim()` and code block cleanup) prevents breakage when model output varies.
- Category standardization and threshold severity (critical > 30% share, high > 15%) make action items meaningful.

6. Closing (15 Seconds)
"The tool turns raw CSV case data into a decision-ready dashboard with one click, hybrid local + OpenRouter intelligence, and persistent caching. It is built modularly so next steps are easy: Slack alerts, scheduled weekly reports, or an admin role-based view.
Thank you for your time, and I look forward to discussing the implementation details further!"