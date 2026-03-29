# Cubelelo Support Insights Tool

A production-ready, AI-powered support ticket analysis platform built with React 18, TypeScript, Tailwind CSS, and OpenRouter API (Free).

## 🎯 Project Overview

This application analyzes support tickets using AI to provide:
- **Executive Summary**: 30-second overview readable by managers
- **Top Issue Categories**: Visual cards showing major problem areas with severity levels
- **Stuck Tickets Table**: Identification of unresolved tickets with AI-generated root cause analysis
- **Key Patterns & Insights**: Actionable recommendations for process improvement

## 🚀 Features

✅ **CSV File Upload** - Drag-and-drop support for ticket data  
✅ **AI-Powered Analysis** - OpenRouter API integration (FREE, multiple AI models)  
✅ **Executive Dashboard** - Manager-friendly 30-second summary  
✅ **Visual Analytics** - Color-coded issue severity indicators  
✅ **Root Cause Analysis** - AI-generated explanations for stuck tickets  
✅ **Pattern Recognition** - Identifies trends and bottlenecks  
✅ **Responsive Design** - Works on desktop, tablet, and mobile  
✅ **Error Handling** - Comprehensive loading and error states  
✅ **Report Export** - Download analysis as JSON  

## 📋 Requirements

### CSV Format
Your support ticket CSV must include these columns:
- `id` - Unique ticket identifier
- `status` - Current ticket status (Open, In Progress, On Hold, Pending, Resolved, Closed)
- `category` - Issue category (Delivery, Quality, Billing, Technical Support, Returns, etc.)
- `createdDate` - Ticket creation date (ISO format)
- `lastUpdatedDate` - Last update date (ISO format)

Optional columns:
- `priority` - Ticket priority level
- `title` - Ticket subject
- `description` - Ticket description
- `assignee` - Assigned team member

### Definitions

**Unresolved Ticket**:
- Status is NOT "Resolved" or "Closed", AND
- No updates for more than 48 hours (>2 days)

**Issue Severity Scale**:
- **Low**: < 5% of tickets
- **Medium**: 5-15% of tickets
- **High**: 15-30% of tickets
- **Critical**: > 30% of tickets

## 🔧 Setup Instructions

### 1. Prerequisites
- Node.js 16+ and npm
- OpenRouter API key (free tier available, no credit card required)

### 2. Get API Key
1. Visit [OpenRouter.ai](https://openrouter.ai/keys)
2. Sign up with email or Google account
3. Generate API key (free tier available, no credit card required)
4. Keep the key secure

### 3. Install Dependencies
```bash
npm install
```

### 4. Development Server
```bash
npm run dev
```

The app will open at `http://localhost:5173`

### 5. Build for Production
```bash
npm run build
```

## 📦 Project Structure

```
src/
├── components/              # React components
│   ├── FileUpload.tsx      # CSV upload component
│   ├── ExecutiveSummary.tsx # Summary display
│   ├── IssueCards.tsx      # Issue category cards
│   ├── StuckTicketsTable.tsx # Unresolved tickets table
│   ├── KeyInsights.tsx     # Patterns & recommendations
│   └── StateIndicators.tsx # Loading & error states
├── hooks/                   # Custom React hooks
│   └── index.ts            # useOpenRouterAnalysis, useCsvParser
├── services/               # API services
│   └── OpenRouterService.ts # OpenRouter API integration (FREE)
├── types/                  # TypeScript interfaces
│   └── index.ts            # All type definitions
├── App.tsx                 # Main app component
├── main.tsx                # React entry point
└── index.css               # Tailwind CSS imports
```

## 🎨 Technology Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Lucide React | Icons |
| OpenRouter API | Analysis engine (FREE) |
| Vite | Build tool |
| papaparse | CSV parsing |

## 🧠 AI Analysis Flow

```
1. User uploads CSV file
2. CSV parsed into Ticket objects
3. Tickets analyzed locally for "unresolved" status (no API calls needed)
4. One optimized prompt sent to OpenRouter API
5. AI returns structured JSON analysis
6. Results displayed in dashboard
```

### Hybrid Architecture (LOCAL + AI)

**Local Processing** (No API calls needed):
- Top issue categorization
- Unresolved ticket identification
- Severity calculation
- Root cause analysis

**OpenRouter API** (Single optimized prompt):
- Executive summary generation
- Pattern identification
- Trend analysis
- Actionable recommendations

This approach = **Unlimited free analysis** with multiple AI models!

Example response structure:
```json
{
  "executiveSummary": "5 line max overview...",
  "topIssues": [
    {
      "name": "Delivery",
      "count": 45,
      "percentage": 22.5,
      "severity": "high"
    }
  ],
  "unresolvedTickets": [
    {
      "id": "T001",
      "status": "Open",
      "reason": "Awaiting customer response",
      "daysSinceUpdate": 5
    }
  ],
  "keyPatterns": [
    {
      "pattern": "High volume of billing disputes",
      "impact": "Customer satisfaction declining",
      "recommendation": "Review billing process automation"
    }
  ]
}
```

## 🎯 User Flow

1. **Settings** → Enter OpenRouter API key (saved to localStorage locally)
2. **Upload CSV** → Drag file or click to browse
3. **Auto Analysis** → System automatically analyzes tickets
4. **View Dashboard** → Executive summary, issues, stuck tickets, insights
5. **Download Report** → Export analysis as JSON

## 💡 Key Features Explained

### Executive Summary
- Maximum 5 lines
- Readable in 30 seconds
- Ideal for team updates and manager briefings

### Issue Cards
- Shows top categories by impact
- Color-coded severity (Red = Critical)
- Visual percentage indicators
- Sortable by impact or name

### Stuck Tickets Table
- Lists unresolved tickets
- AI-generated root causes
- Days since last update
- Status badges with visual indicators

### Key Insights
- Pattern identification
- Business impact analysis
- Actionable recommendations
- Sortable by impact

## 🔒 Security

- API keys stored in browser localStorage
- Data sent only to OpenRouter API (no internal servers)
- CSV data processed locally in browser
- All analysis happens in real-time
- HTTPS only in production

## 📊 Example Output

```markdown
Executive Summary:
- 20% of tickets are stuck (40 of 200)
- Delivery category represents 25% of workload
- Average resolution time is 5.2 days
- Billing disputes up 15% this week
- Quality issues trending down

Top Issues:
1. Delivery - 50 tickets (25%) - HIGH
2. Quality - 35 tickets (17.5%) - MEDIUM
3. Billing - 30 tickets (15%) - MEDIUM

Stuck Tickets:
T001 (Open for 5 days) - Awaiting customer response
T002 (On Hold for 3 days) - Awaiting management approval
T003 (Pending for 4 days) - Missing required documentation

Insights:
- Delivery bottleneck: Address validation system down
- Quality spike: New supplier introduced last week
- Billing pattern: Invoice formatting issues
```

## 🚦 Loading & Error States

- **Loading**: Animated spinner with progress message
- **CSV Parse Error**: Alert with specific parsing issue
- **API Error**: Detailed error message with failure code
- **No Data**: Friendly message to upload CSV
- **API Key Missing**: Modal to set up OpenRouter API key

## 📱 Responsive Design

- **Desktop** (1024px+): Full 3-column layout
- **Tablet** (768px-1023px): 2-column grid
- **Mobile** (<768px): Single column, full width

## 🎓 Learning Resources

- [Google Generative AI Python SDK](https://github.com/google/generative-ai-python)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🐛 Troubleshooting

### "API Key not set"
- Click Settings button
- Enter valid OpenRouter API key from https://openrouter.ai/keys
- Save and retry analysis

### "Failed to parse CSV"
- Ensure CSV has required columns
- Check date format (use ISO format: YYYY-MM-DDTHH:MM:SSZ)
- Verify no special characters in critical fields

### "Analysis failed"
- Check API rate limits (60 requests/minute free tier)
- Verify internet connection
- Try with smaller dataset first

## 📄 License

This project is part of the Cubelelo assignment for educational purposes.

## 👤 Author

Built as a production-ready demonstration of React + TypeScript + Tailwind + AI integration.

---

**Note**: Keep your OpenRouter API key confidential. The app stores it locally in your browser only.
