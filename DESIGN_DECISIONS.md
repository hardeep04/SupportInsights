# Design Decisions & Architecture

## Overview

The Cubelelo Support Insights Tool is built with a focus on:
- **Performance**: Efficient data processing and rendering
- **Maintainability**: Clear separation of concerns and modular architecture
- **UX**: Responsive, accessible, and intuitive interface
- **Scalability**: Extensible component and service architecture

---

## Architecture Decisions

### 1. Component Structure

**Pattern**: Feature-Based Organization

```
src/
├── components/        # Reusable UI components
├── services/         # External API integrations
├── hooks/           # Custom React logic
└── types/           # TypeScript interfaces
```

**Rationale**:
- Components are self-contained and reusable
- Services handle external integrations (OpenRouter API)
- Hooks encapsulate stateful logic
- Types ensure type safety across application

### 2. State Management

**Pattern**: Local Component State + Custom Hooks

**Choice**: Did NOT use Redux/Context for this project because:
- Small to medium application (single major feature)
- Limited data sharing between components
- Custom hooks suffice for data orchestration
- Reduces bundle size and complexity

**Implementation**:
- `useState` in App.tsx for main analysis state
- `useOpenRouterAnalysis` hook for API calls
- `useCsvParser` hook for file parsing
- LocalStorage for API key persistence

### 3. API Integration Strategy

**Pattern**: Service Layer with Error Handling

**Key Design Choices**:

```typescript
// Singleton service instance
class OpenRouterService {
  private apiKey: string | null = null;
  private baseUrl = 'https://openrouter.ai/api/v1/chat/completions';
  
  setApiKey(key: string) { ... }
  analyzeTickets(tickets: Ticket[]) { ... }
}

export default new OpenRouterService();
```

**Rationale**:
- Single instance manages OpenRouter connection
- Decouples components from API details
- Hybrid approach: Local + AI processing
- Enables easy testing and mocking
- Centralized error handling
- Free tier support with no credit card

### 4. Data Flow

```
User Upload CSV
       ↓
useCsvParser Hook
       ↓
Parse CSV → Ticket[]
       ↓
Auto-trigger useOpenRouterAnalysis
       ↓
OpenRouterService.analyzeTickets()
       ↓
LOCAL: Calculate stats & unresolved (no API cost)
       ↓
API: Send optimized prompt to OpenRouter
       ↓
AI: Generate insights & patterns
       ↓
Parse JSON Response
       ↓
Update UI with Analysis
```

**Hybrid Benefits**:
- Fast local processing for statistics
- Single API call for AI insights
- Cost-effective (no credit card needed)
- Unlimited analysis sessions

### 5. Type Safety

**Pattern**: TypeScript Interfaces for All Data

```typescript
// Core types
interface Ticket { ... }
interface AnalysisResponse { ... }
type AnalysisStatus = 'idle' | 'loading' | 'success' | 'error'
```

**Benefits**:
- Compile-time error checking
- Better IDE autocomplete
- Self-documenting code
- Prevents runtime errors

---

## UI/UX Decisions

### 1. Color Scheme

**Severity-Based Coloring**:
- 🔴 Critical: Red/Orange
- 🟠 High: Amber/Orange
- 🟡 Medium: Blue
- 🟢 Low: Green

**Rationale**:
- Follows common conventions
- Accessible for colorblind users (also use icons)
- Professional enterprise appearance
- Consistent with Tailwind palette

### 2. Responsive Design

**Breakpoints**:
- Mobile: < 768px (single column)
- Tablet: 768px-1024px (2 columns)
- Desktop: > 1024px (3 columns, 2 columns)

**Implementation**:
- Tailwind CSS responsive utilities
- Mobile-first design approach
- Touch-friendly button sizes (48px min)

### 3. Loading States

**Pattern**: Progressive Enhancement

```
Idle → Loading (Spinner) → Success (Content) or Error (Alert)
```

**UX Improvements**:
- Animated spinner during analysis
- Clear progress message
- Prevents button mashing
- Graceful error recovery

---

## Key Implementation Details

### 1. "Unresolved" Ticket Definition

```typescript
private isUnresolved(ticket: Ticket): boolean {
  const unresolvedStatuses = ['Open', 'In Progress', 'On Hold', 'Pending'];
  
  // If resolved/closed → not unresolved
  if (ticket.status includes 'Resolved' or 'Closed') return false;
  
  // If open status + stagnant >48h → unresolved
  if (unresolvedStatus && daysSinceUpdate > 2) return true;
  
  return false;
}
```

**Rationale**:
- Matches business requirements
- Case-insensitive status matching (flexible)
- Time-based detection for stagnant tickets

### 2. Prompt Engineering

**Hybrid Approach (OpenRouter)**:

```
STEP 1: LOCAL PROCESSING (No API calls)
- Calculate top issue categories
- Identify unresolved tickets
- Compute severity levels
- Analyze root causes
- Build summary data

STEP 2: OPTIMIZED PROMPT (Single API call)
- Send essential data only
- Include summary statistics
- Request structured JSON response
- Keep token usage minimal

STEP 3: RESPONSE PARSING
- Parse JSON from AI
- Remove markdown code blocks if present
- Validate structure
- Provide fallback defaults
```

**Prompt Structure**:
```
User Message:
1. Summary statistics (total, unresolved %)
2. Top issue categories
3. Key problem products
4. Specific request for format
5. Call-to-action

Response Format:
{
  "summary": "5-line executive summary",
  "patterns": [
    {
      "pattern": "observed pattern",
      "impact": "business impact",
      "recommendation": "action to take"
    }
  ]
}
```

**Error Handling**:
- Strips markdown code blocks (```json ... ```)
- Validates JSON syntax
- Handles partial responses gracefully
- Falls back to defaults if parsing fails

**Cost Optimization**:
- ✅ Local processing = No API cost
- ✅ Single prompt = Minimal tokens
- ✅ OpenRouter free tier = No credit card
- ✅ Multiple model support = Auto-optimization

### 3. CSV Parsing

**Simple Line-by-Line Parser**:
```typescript
const lines = csv.split('\n');
const headers = lines[0].split(',').map(h => h.trim());
// For each line, map columns to fields
```

**Why not Papa Parse library?**
- Too heavy for simple CSV
- Custom parser gives more control
- Handles missing fields gracefully

### 4. Local Storage Strategy

**Persistence Implementation**:
```typescript
// Save API key
localStorage.setItem('openrouter-api-key', apiKey);

// Save parsed tickets (cached on page refresh)
localStorage.setItem('_cache_tickets', JSON.stringify(parsedData));

// Save analysis results
localStorage.setItem('_cache_analysis', JSON.stringify(analysis));

// Retrieve on application mount
const savedKey = localStorage.getItem('openrouter-api-key');
const cachedTickets = localStorage.getItem('_cache_tickets');
const cachedAnalysis = localStorage.getItem('_cache_analysis');
```

**Persistence Features**:
- ✅ API key persists across sessions
- ✅ CSV data survives page refresh (no re-upload needed)
- ✅ Analysis results cached locally
- ✅ All data stored in browser (100% private)

**Advantages**:
- Users don't lose data on accidental refresh
- Fast data retrieval on page reload
- No server uploads of sensitive data
- Instant re-load of previous analysis

**Limitations**:
- Browser storage limit (~5-10MB per site)
- Data lost if browser cache cleared
- Not synced across devices
- For large datasets (10K+ tickets), may reach storage limits

**Security Note**:
- LocalStorage is NOT encrypted
- Keys visible in browser DevTools
- Data stays in user's browser only
- For production: Consider backend proxy for API calls

---

## Performance Optimizations

### 1. Code Splitting

- Components are modular (lazy could be added)
- Services are separate files
- Hooks are isolated

### 2. Rendering Optimization

- Avoid unnecessary re-renders
- Use `useCallback` for memoized functions
- Conditional rendering for components

### 3. Bundle Size

- Tailwind CSS purging enabled
- Tree-shaking in Vite
- Minimal dependencies

---

## Extensibility

### How to Add New Features

#### 1. New Analysis Type
```typescript
// 1. Add interface to types/index.ts
interface NewAnalysis { ... }

// 2. Add method to OpenRouterService
async analyzeNewType(data: any) { ... }

// 3. Create custom hook
export function useNewAnalysis() { ... }

// 4. Create component
export const NewComponent = ...
```

#### 2. New UI Component
```typescript
// 1. Create file in src/components/
// 2. Use existing Tailwind classes
// 3. Export from components/index.ts
// 4. Import in App.tsx
```

#### 3. New Data Source
```typescript
// 1. Create parser hook (useCsvParser pattern)
// 2. Add to App.tsx upload section
// 3. Convert to Ticket[] format
```

---

## Testing Strategy

### Unit Testing (Not Implemented)

Could add:
```typescript
// useOpenRouterAnalysis.test.ts
describe('useOpenRouterAnalysis', () => {
  test('should handle API errors gracefully', () => { ... })
  test('should parse valid OpenRouter response', () => { ... })
  test('should persist data to localStorage', () => { ... })
  test('should load cached data on mount', () => { ... })
})
```

### Integration Testing

Could test:
- CSV parsing → Analysis flow
- Error handling
- State management

### E2E Testing (Cypress/Playwright)

Could test:
- Upload CSV
- View analysis
- Download report

---

## Known Limitations & Future Improvements

### Current Limitations
1. Single CSV file upload (no batch mode)
2. OpenRouter rate depends on selected model (generous free tier)
3. ✅ ~~No caching~~ **Now cached!** - Data persists across page refreshes
4. No user authentication
5. Basic CSV parser (handles simple cases)
6. Browser storage limit for large datasets (10K+ tickets)

### Potential Improvements
1. **Database Integration**: Store analyses for historical comparison
2. **Real-time Sync**: WebSockets for live ticket updates
3. **Custom Reports**: User-defined report templates
4. **Collaboration**: Team sharing and annotations
5. **Webhooks**: Integrate with ticketing systems (Jira, Zendesk)
6. **Advanced Charting**: D3.js or Chart.js visualizations
7. **ML Models**: Custom models for better predictions
8. **Multi-language**: i18n support
9. **Export to Server**: Backend persistence for large teams

---

## Security Considerations

### Current Implementation
- API key in browser localStorage
- No data persisted on server
- No authentication required

### Recommended for Production
```typescript
// Backend proxy for API calls
POST /api/analyze
  headers: Authorization: Bearer <server-token>
  body: { tickets: Ticket[] }
  response: Analysis

// Server makes API call with its own key
// Prevents client-side key exposure
```

### Compliance
- No GDPR/HIPAA specific implementations
- For sensitive data: implement additional encryption

---

## Build & Deployment

### Development
```bash
npm run dev    # Start dev server on port 5173
```

### Production Build
```bash
npm run build  # Creates dist/
```

### Deployment Options
1. **Vercel**: `vercel deploy`
2. **Netlify**: Connect GitHub repo
3. **AWS**: S3 + CloudFront
4. **Self-hosted**: Any static server

---

## Code Quality

### TypeScript Strict Mode
- All types explicitly defined
- No `any` type usage
- Compile-time safety

### Linting (Recommended)
```bash
npm run lint  # ESLint configuration ready
```

### Code Style
- Consistent indentation (2 spaces)
- Prettier-compatible formatting
- Clear variable naming

---

## Conclusion

The architecture balances:
- **Simplicity** for quick development
- **Scalability** for future growth
- **Maintainability** for long-term support
- **Performance** for smooth UX

The design is flexible enough to evolve as requirements change.
