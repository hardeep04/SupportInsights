# Component Documentation

## Overview

All components are designed to be modular, reusable, and type-safe with TypeScript.

---

## Core Components

### 1. FileUpload

**Path**: `src/components/FileUpload.tsx`

**Purpose**: CSV file upload with drag-and-drop support

**Props**:
```typescript
interface FileUploadProps {
  onFileSelect: (file: File) => void;  // Callback when file selected
  isLoading: boolean;                   // Show loading state
  selectedFileName?: string;            // Display selected file info
}
```

**Features**:
- ✅ Drag-and-drop interface
- ✅ Click to browse file system
- ✅ CSV validation
- ✅ Visual loading spinner
- ✅ Selected file display

**Usage**:
```tsx
<FileUpload
  onFileSelect={(file) => parseFile(file)}
  isLoading={isParsingCsv}
  selectedFileName="tickets.csv"
/>
```

**Styling**: Dashed border, blue 50 background, hover effects

---

### 2. ExecutiveSummary

**Path**: `src/components/ExecutiveSummary.tsx`

**Purpose**: Display AI-generated 30-second summary for managers

**Props**:
```typescript
interface ExecutiveSummaryProps {
  summary: string;      // Raw summary text (split by \n)
  isLoading?: boolean;  // Show skeleton loading
}
```

**Features**:
- ✅ Max 5 lines display
- ✅ Icon badge with alert indicator
- ✅ Loading skeleton animation
- ✅ Timestamp footer
- ✅ Bullet point formatting

**Usage**:
```tsx
<ExecutiveSummary
  summary={analysis.executiveSummary}
  isLoading={status === 'loading'}
/>
```

**Styling**: Amber accent color, card layout with icon badge

---

### 3. IssueCards

**Path**: `src/components/IssueCards.tsx`

**Purpose**: Display top issue categories with severity levels

**Props**:
```typescript
interface IssueCardsProps {
  issues: IssueCategory[];  // Array of issues
  isLoading?: boolean;      // Show loading skeletons
}
```

**IssueCategory Format**:
```typescript
interface IssueCategory {
  name: string;              // Category name (e.g., "Delivery")
  count: number;             // Number of tickets
  percentage: number;        // Percentage of total
  severity: 'low'|'medium'|'high'|'critical';
}
```

**Features**:
- ✅ Grid layout (responsive: 1→2→3 columns)
- ✅ Color-coded severity (Red→Orange→Blue→Green)
- ✅ Severity icons (AlertOctagon for critical)
- ✅ Progress bars
- ✅ Loading skeleton animation

**Severity Colors**:
- `critical`: Red background, red/orange icon
- `high`: Orange background, triangle icon
- `medium`: Blue background, circle icon
- `low`: Green background, circle icon

**Usage**:
```tsx
<IssueCards
  issues={analysis.topIssues}
  isLoading={status === 'loading'}
/>
```

---

### 4. StuckTicketsTable

**Path**: `src/components/StuckTicketsTable.tsx`

**Purpose**: Display unresolved tickets with reasons

**Props**:
```typescript
interface StuckTicketsTableProps {
  tickets: UnresolvedTicket[];  // List of stuck tickets
  isLoading?: boolean;          // Show loading animation
}
```

**UnresolvedTicket Format**:
```typescript
interface UnresolvedTicket {
  id: string;            // Ticket ID
  status: string;        // Current status
  reason: string;        // AI-generated reason
  daysSinceUpdate: number; // Days without update
}
```

**Features**:
- ✅ 4-column table (ID, Status, Days, Reason)
- ✅ Status badge colors (Open→Hold→Progress)
- ✅ Staleness color coding (Red >7d, Orange 3-7d)
- ✅ Code-formatted ticket IDs
- ✅ Scrollable on mobile
- ✅ Shows first 15 tickets with count

**Table Columns**:
1. **Ticket ID**: Blue badge with monospace font
2. **Status**: Color-coded badge
3. **Days Stale**: Icon + colored badge
4. **Reason**: Text description (max-width: 448px)

**Usage**:
```tsx
<StuckTicketsTable
  tickets={analysis.unresolvedTickets}
  isLoading={status === 'loading'}
/>
```

---

### 5. KeyInsights

**Path**: `src/components/KeyInsights.tsx`

**Purpose**: Display patterns, impact, and recommendations

**Props**:
```typescript
interface KeyInsightsProps {
  patterns: KeyPattern[];  // List of patterns
  isLoading?: boolean;     // Show loading animation
}
```

**KeyPattern Format**:
```typescript
interface KeyPattern {
  pattern: string;      // Observed pattern/trend
  impact: string;       // Business impact
  recommendation: string; // Action to take
}
```

**Features**:
- ✅ Card layout with gradient
- ✅ Trend icon (TrendingDown)
- ✅ Two-column layout (Impact | Recommendation)
- ✅ Loading skeleton animation
- ✅ Pro tips box with blue styling
- ✅ Hover shadow effect

**Usage**:
```tsx
<KeyInsights
  patterns={analysis.keyPatterns}
  isLoading={status === 'loading'}
/>
```

---

## State Indicator Components

### 6. LoadingSpinner

**Path**: `src/components/StateIndicators.tsx`

**Purpose**: Full-screen loading overlay with spinner

**Props**:
```typescript
interface Props {
  message?: string;  // Optional loading message
}
```

**Default Message**: "Analyzing your support tickets..."

**Features**:
- ✅ Full-screen overlay (fixed positioning)
- ✅ Animated circular spinner
- ✅ Backdrop blur effect
- ✅ Centered content
- ✅ Custom progress message

**Usage**:
```tsx
{status === 'loading' && <LoadingSpinner message="Analyzing..." />}
```

---

### 7. ErrorAlert

**Path**: `src/components/StateIndicators.tsx`

**Purpose**: Display error messages with dismiss option

**Props**:
```typescript
interface ErrorAlertProps {
  error: AnalysisError | string;  // Error object or message
  onDismiss?: () => void;         // Dismiss callback
  isAlert?: boolean;              // Position: fixed vs inline
}
```

**Features**:
- ✅ Red left border indicator
- ✅ Alert icon
- ✅ Dismissible button (X)
- ✅ Fixed or inline positioning
- ✅ Error code display (if object)

**Usage**:
```tsx
{error && (
  <ErrorAlert
    error={error.message}
    onDismiss={() => setError(null)}
    isAlert={true}
  />
)}
```

---

### 8. NoDataMessage

**Path**: `src/components/StateIndicators.tsx`

**Purpose**: Empty state message

**Props**: None

**Features**:
- ✅ Centered layout
- ✅ Icon badge
- ✅ Helpful message

**Usage**:
```tsx
{parsedData.length === 0 && <NoDataMessage />}
```

---

## Container Component

### App

**Path**: `src/App.tsx`

**Purpose**: Main application container and orchestrator

**Key Responsibilities**:
1. State management (API key, modal visible)
2. File handling (upload, parse CSV)
3. Analysis orchestration
4. Error handling
5. Modal dialog management

**State**:
```typescript
const [apiKey, setApiKey] = useState(string);
const [tempApiKey, setTempApiKey] = useState(string);
const [modalOpen, setModalOpen] = useState(boolean);
const [modalTab, setModalTab] = useState('setup'|'about');
```

**Custom Hooks Used**:
- `useOpenRouterAnalysis()` - AI analysis logic
- `useCsvParser()` - CSV parsing logic

**Side Effects**:
- Update OpenRouter API key on mount
- Auto-analyze when CSV parsed
- Save API key to localStorage

**Features**:
- ✅ Sticky header with logo
- ✅ Download button (when analysis available)
- ✅ Clear Data button (when CSV loaded) - visible in header
- ✅ Settings button with modal
- ✅ API key configuration modal
- ✅ Data management (clear cache)
- ✅ Settings tabs (Setup, Data, About)
- ✅ Full dashboard layout

---

## Modal Tabs

### 1. Setup API Tab

**Purpose**: Configure OpenRouter API key

**Features**:
- ✅ Password input field (secure)
- ✅ OpenRouter documentation link
- ✅ Save button (disabled if empty)
- ✅ Input validation

---

### 2. Data Management Tab

**Purpose**: Manage cached data

**Features**:
- ✅ Warning message about data clearing
- ✅ Red clear button with confirmation warning
- ✅ Clears both CSV cache and analysis results
- ✅ Auto-reloads page after clearing

**Action**: 
```typescript
// Clears localStorage and reloads
localStorage.removeItem('_cache_tickets');
localStorage.removeItem('_cache_analysis');
window.location.reload();
```

**Use Case**: When user wants to start fresh or has accumulated too much cached data

---

### 3. About Tab

**Purpose**: Display tool information

**Features**:
- ✅ Tool description
- ✅ Feature list
- ✅ Tech stack display

---

## Custom Hooks

### useOpenRouterAnalysis

**Path**: `src/hooks/index.ts`

**Purpose**: Manages AI analysis lifecycle using OpenRouter

**Returns**:
```typescript
interface UseOpenRouterAnalysisResult {
  analysis: AnalysisResponse | null;
  status: 'idle'|'loading'|'success'|'error';
  error: AnalysisError | null;
  analyzeTickets: (tickets: Ticket[]) => Promise<void>;
  reset: () => void;
  setApiKey: (key: string) => void;
}
```

**Usage**:
```tsx
const { analysis, status, error, analyzeTickets } = useOpenRouterAnalysis();

// Analyze tickets
await analyzeTickets(parsedData);

// Check status
if (status === 'loading') { /* show spinner */ }
if (status === 'error') { /* show error */ }
if (status === 'success') { /* show results */ }
```

**Lifecycle**:
```
idle → loading → success|error
             ↓
           reset → idle
```

**Features**:
- ✅ Auto-loads cached analysis on page refresh
- ✅ Persists results to localStorage
- ✅ Comprehensive error handling
- ✅ OpenRouter API integration

---

### useCsvParser

**Path**: `src/hooks/index.ts`

**Purpose**: Handles CSV file parsing

**Returns**:
```typescript
interface Result {
  parsedData: Ticket[];         // Parsed tickets
  parseError: string | null;    // Error message
  isLoading: boolean;           // Parsing state
  parseFile: (file: File) => void;
  reset: () => void;
}
```

**Usage**:
```tsx
const { parsedData, parseError, parseFile } = useCsvParser();

// Parse file
parseFile(csvFile);

// Use parsed data
if (parsedData.length > 0) { /* analyze */ }
```

**Features**:
- ✅ Async file reading
- ✅ CSV parsing with headers
- ✅ Flexible column mapping
- ✅ Error handling
- ✅ Reset function
- ✅ Auto-loads cached data on page refresh

---

## API Service

### OpenRouterService

**Path**: `src/services/OpenRouterService.ts`

**Purpose**: Wrapper around OpenRouter API with hybrid processing

**Architecture**:
```
Local Processing (No API calls):
- Top issue categorization
- Unresolved ticket identification
- Severity calculation
- Root cause analysis

OpenRouter API (Single prompt):
- Executive summary generation
- Pattern identification
- Trend analysis
- Actionable recommendations
```

**Methods**:

#### `setApiKey(key: string)`
```typescript
OpenRouterService.setApiKey('sk-...');
```

#### `analyzeTickets(tickets: Ticket[]): Promise<AnalysisResponse>`
```typescript
const result = await OpenRouterService.analyzeTickets(tickets);
```

Returns structured analysis:
```typescript
{
  executiveSummary: string;
  topIssues: IssueCategory[];
  unresolvedTickets: UnresolvedTicket[];
  keyPatterns: KeyPattern[];
}
```

#### `validateApiKey(): Promise<boolean>`
```typescript
const isValid = await OpenRouterService.validateApiKey();
```

**Features**:
- ✅ Hybrid approach: Local + AI processing
- ✅ Multiple AI model support
- ✅ Auto-model selection
- ✅ Comprehensive error handling
- ✅ Efficient resource usage (limited API calls)
- ✅ Free tier support

**Advantages**:
- **No credit card required** for free tier
- **Lower cost** - only one API call per analysis
- **Multiple models** - OpenRouter auto-selects best available
- **No rate limits** - unlimited analysis sessions

**Error Handling**:
- Catches JSON parse errors
- Validates response structure
- Provides helpful error messages
- Handles network timeouts gracefully

---

## Type Definitions

### Core Types

```typescript
// Ticket data
interface Ticket {
  id: string;
  status: string;
  category: string;
  createdDate: string;
  lastUpdatedDate: string;
  priority?: string;
  title?: string;
  description?: string;
  assignee?: string;
}

// Analysis result
// Analysis result
interface AnalysisResponse {
  executiveSummary: string;
  topIssues: IssueCategory[];
  unresolvedTickets: UnresolvedTicket[];
  keyPatterns: KeyPattern[];
}

// Status enum
type AnalysisStatus = 'idle' | 'loading' | 'success' | 'error';
```

---

## Styling & Tailwind Classes

### Custom Utilities
```css
.card           /* White card with shadow & border */
.card-hover     /* Add hover effects to cards */
.btn-primary    /* Blue button styling */
.btn-secondary  /* Gray button styling */
.input-field    /* Form input styling */
```

### Color Tokens

**Severity Colors**:
- Red: `text-red-600`, `bg-red-50`
- Amber: `text-amber-600`, `bg-amber-50`
- Blue: `text-blue-600`, `bg-blue-50`
- Green: `text-green-600`, `bg-green-50`

**Slate Grays** (main UI):
- `slate-50`: Almost white
- `slate-900`: Almost black
- `slate-600`: Medium gray

---

## Best Practices

### Component Guidelines

✅ **DO**:
- Keep components focused (single responsibility)
- Use TypeScript interfaces for all props
- Handle loading and error states
- Make components reusable
- Use composition over inheritance

❌ **DON'T**:
- Mix business logic with UI logic
- Use `any` type in TypeScript
- Create giant components (>300 lines)
- Prop drill more than 2 levels
- Use inline styles (use Tailwind)

### Hook Guidelines

✅ **DO**:
- Start hook names with `use`
- Return typed objects
- Handle all error cases
- Clean up side effects
- Call hooks from top level

❌ **DON'T**:
- Call hooks conditionally
- Use hooks in loops
- Create hooks inside components
- Ignore cleanup (useEffect cleanup)

---

## Testing Components

### Example Test Structure
```typescript
// components/IssueCards.test.tsx
describe('IssueCards', () => {
  test('renders issues with severity colors', () => {
    const mockIssues = [
      {
        name: 'Delivery',
        count: 50,
        percentage: 25,
        severity: 'high'
      }
    ];
    
    render(<IssueCards issues={mockIssues} />);
    expect(screen.getByText('Delivery')).toBeInTheDocument();
  });
});
```

---

## Performance Tips

1. **Memoization**: Use `React.memo()` for expensive components
2. **Code Splitting**: Lazy load heavy components with `React.lazy()`
3. **Key Props**: Always use stable keys in lists
4. **useCallback**: Memoize callbacks passed to children
5. **useMemo**: Memoize expensive computations

---

## Accessibility

All components follow:
- ✅ Semantic HTML (`<button>`, `<table>`, etc.)
- ✅ Color + icon indicators (not color alone)
- ✅ ARIA labels where needed
- ✅ Keyboard navigation support
- ✅ Focus indicators

---

## Dark Mode Support (Optional Enhancement)

To add dark mode, add to tailwind.config:
```javascript
darkMode: 'class',

// Then use in components:
// <div className="dark:bg-slate-900">
```

---

This completes the component documentation. Each component is designed to be production-ready and maintainable.
