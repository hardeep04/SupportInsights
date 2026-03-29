# Cubelelo Support Insights Tool - Video Presentation Script

## Introduction

- Hello, I’m [Your Name], AI Tools & Internal Operations Intern candidate.
- Today I’m presenting the Cubelelo Support Insights tool prototype, built to convert raw support ticket data into a clear, actionable weekly summary.
- This demo follows the assignment goals for faster, informed support operations decisions.

## 1. What this tool solves (Use Cases)

### Use Case 1: Weekly support triage for managers
- Problem: Managers can’t quickly see most common issues, unresolved tickets, and patterns.
- Solution: Upload CSV of ticket data and get an immediate dashboard with top categories and SLA risk.

### Use Case 2: Prioritizing unresolved tickets
- Problem: Tickets in open state stay unresolved for days with no clear action path.
- Solution: Tool flags unresolved tickets, provides AI reasons and priority, and generates an action plan.

### Use Case 3: Operational trend discovery
- Problem: By-the-hour tickets hide product or process patterns (e.g., a product causing repeated complaints).
- Solution: Auto analysis surfaces patterns and recommends process improvements.

### Use Case 4: Team update summary
- Problem: Crafting a concise 30-second manager summary is time-consuming.
- Solution: AI-generated manager summary (5-line format) ready for weekly brief.

## 2. Demo of the solution (i)

- Start at the landing page.
- Upload a support ticket CSV in the provided sample format (Ticket ID, Status, Category, Date, etc.).
- Watch as the parser normalizes data and stores it locally.
- Dashboard appears with:
  - Executive summary (AI-generated bullet points)
  - Stats cards (total, unresolved, categories)
  - Anomalies component (outliers and risk signs)
- Go to “Analysis” tab:
  - Top issue categories with counts, percentages, and visual chart.
  - Product and category trend charts.
- Go to “Bottlenecks” tab:
  - Table of unresolved tickets with reason and days since update.
  - This highlights tickets blocked by delivery, replacement, refunds, defects, etc.
- Go to “Action Plan” tab:
  - Prioritized, time-bound action items across critical/high/medium levels.
  - Includes ownership, timeline, expected impact, and next steps.

## 3. Key decisions (ii)

- Hybrid AI + local logic:
  - Local analysis to compute totals, category severity, and unresolved classification (no API cost for basics).
  - Single optimized API call to OpenRouter for final executive summary and patterns.
- Unresolved definition:
  - `Open` or `In Progress` in status.
  - Ticket age and days since last update used to identify stale tickets.
- Category merging for clarity:
  - Delivery-related, product quality, wrong/missing handling.
  - Makes top issue cards intuitive and reduces noise.
- Action plan automation:
  - Generated from ticket severity and pattern advice as immediate/preventive/strategic items.
  - Ensures 30-second readout for managers.
- CSV parsing designed for robustness:
  - Tolerates multiple header variants, quoted values.
  - Normalizes status/category to clean values.

## 4. Challenges faced (iii)

- Data quality and format consistency:
  - Source tickets can vary widely in category names and status labels.
  - Solution: aggressive normalization and fallback default values.
- Balancing AI and deterministic logic:
  - Need accurate unresolved detection even without API.
  - Solution: local `isUnresolved` pipeline + AI for high-level narrative.
- Ensuring the manager summary remains concise:
  - AI output can be lengthy or verbose.
  - Solution: response required in fixed JSON structure with 5 bullet lines.
- Handling API reliability:
  - OpenRouter can return code blocks or non-JSON text.
  - Solution: parser strips markdown fences and parses safely.

## 5. Walkthrough of architecture and files

- `src/types/index.ts`: core domain models (`Ticket`, `IssueCategory`, `UnresolvedTicket`, `KeyPattern`).
- `src/services/OpenRouterService.ts`: analysis engine (unresolved logic, severity, prompt, API call, parse response).
- `src/hooks/index.ts`: custom hooks for CSV parsing and AI analysis state.
- `src/App.tsx`: main views and flow controller.
- `src/components/`:
  - `IssueCards`, `CategoryCharts`, `StuckTicketsTable`, `KeyInsights`, `PlanOfAction`, `ExecutiveSummary`.

## 6. How it delivers hiring assignment expectations

- Business focus:
  - “What is broken this week?” and “What is next?” in 30 seconds.
- Aligned with assignment problem areas:
  - Delivery delays, damaged products, wrong item shipping, refund/replacement delays, product quality.
- Clear metrics:
  - Top categories, unresolved rate, stale ticket count.
- Actionable outcomes:
  - Ticket-level reasons and role-based tasks.

## 7. Next improvements (bonus)

- Add “Auto weekly report export” (PDF/Slack/Teams).
- Add manual feedback for AI reasons (approve/override to retrain rules).
- Add time-series weekly comparison (trend line for issue categories, unresolved growth).

## Closing

- Thank you for the review.
- The prototype is ready for immediate evaluation and can be extended to full production in the next sprint.
- I am happy to take questions from the hiring manager or walk through the code in deeper detail.
