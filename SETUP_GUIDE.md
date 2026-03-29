# Setup Guide - Cubelelo Support Insights Tool

## Quick Start (5 minutes)

### Step 1: Get OpenRouter API Key (2 minutes)

1. Go to [OpenRouter.ai](https://openrouter.ai/keys)
2. Sign up (email or Google account - no credit card required)
3. Click **"Create New API Key"**
4. Copy the generated API key
5. Keep it safe - you'll need it in Step 4

### Step 2: Install Node.js (If needed)

- Download from [nodejs.org](https://nodejs.org) (LTS version recommended)
- Verify installation:
  ```bash
  node --version
  npm --version
  ```

### Step 3: Install Dependencies

Navigate to project folder and run:

```bash
npm install
```

This installs all required packages (React, TypeScript, Tailwind, OpenRouter integration, etc.)

### Step 4: Start Development Server

```bash
npm run dev
```

The app will open automatically at `http://localhost:5173`

### Step 5: Configure API Key in App

1. Click **Settings** button (top right)
2. Click **"Setup API"** tab
3. Paste your OpenRouter API key
4. Click **"Save API Key"**

That's it! You're ready to analyze.

---

## Using the Application

### Upload Your Data

1. **Prepare CSV File** with columns:
   - `id` - Ticket ID (e.g., "T001")
   - `status` - Status (Open, In Progress, Resolved, etc.)
   - `category` - Category (Delivery, Quality, Billing, Technical Support, Returns)
   - `createdDate` - Creation date (ISO format: 2024-03-20T08:00:00Z)
   - `lastUpdatedDate` - Last update (ISO format: 2024-03-20T08:00:00Z)

2. **Upload File**:
   - Drag CSV onto upload area, OR
   - Click to browse and select file
   - System starts analyzing automatically

3. **View Results**:
   - **Executive Summary** - Quick 30-second overview
   - **Issue Cards** - Top problems with severity
   - **Stuck Tickets** - Unresolved items and reasons
   - **Key Insights** - Patterns and recommendations

### Download Report

Click **"Download"** button to save analysis as JSON file

---

## Testing the App

### Option A: Use Sample Data

Use the included `sample-tickets.csv`:
1. Click upload area
2. Select `sample-tickets.csv` from project folder
3. System analyzes 20 sample tickets

### Option B: Use Your Own Data

1. Export your support tickets to CSV
2. Ensure columns match requirements
3. Upload to app

---

## Troubleshooting

### "Module not found" error
**Solution**: Run `npm install` again

### "Invalid API key" message
**Solution**: 
- Check your OpenRouter API key from https://openrouter.ai/keys
- Ensure it starts with `sk-` (OpenRouter format)
- Make sure it's not expired
- Try regenerating a new key

### "API Error" during analysis
**Solution**:
- Verify internet connection
- Check OpenRouter service status at https://status.openrouter.ai
- Try analyzing again with fewer tickets
- OpenRouter uses multiple AI models - it auto-selects the best available

---

## 💡 Pro Tips

### Persistence Feature ✨
**Your uploaded CSV data is automatically cached!**
- When you refresh the page, your ticket data remains (thanks to browser localStorage)
- Analysis results from your last session are also cached
- You only need to re-upload if you want to analyze different data
- Cache is stored locally in your browser (no server upload)

### Clearing Cached Data 🗑️
**Need to start fresh?**
1. Click **"Clear"** button in the top right (visible when CSV is loaded)
2. Confirm the warning dialog
3. Page reloads with all cache cleared
4. You can now upload a fresh CSV file

**Alternative method** (via Settings modal):
1. Click **Settings** button (top right)
2. Click **"Data"** tab
3. Click **"Clear All Data"** button

**Why clear data?**
- To analyze a completely different dataset
- If you've reached browser storage limits (very rarely)
- To maintain privacy/free up space

### Large Datasets
- For datasets with 1000+ tickets, analysis may take longer
- OpenRouter automatically selects the optimal AI model based on availability
- If a timeout occurs, try analyzing a subset of tickets

### Multiple Analysis Sessions
- Each upload overwrites the previous cached data
- Download reports before uploading new data if you want to keep them
- Reports are separate from the cache

### "API Key is invalid"
**Solution**:
1. Go back to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Generate a new key
3. Update in Settings

### "CSV parsing failed"
**Solution**:
- Check column names match exactly (case-sensitive)
- Use ISO date format: `2024-03-20T08:00:00Z`
- Open CSV in Excel/Sheets to verify formatting

### "Analysis takes too long"
**Solution**:
- Check internet connection
- First analysis is slower (model loading)
- Try with smaller dataset (< 200 tickets)

### Port 5173 already in use
**Solution**:
```bash
# Use different port
npm run dev -- --port 5174
```

---

## Building for Production

```bash
npm run build
```

Creates optimized `dist` folder for deployment.

Deploy to:
- Vercel
- Netlify  
- AWS S3 + CloudFront
- Your own server

### 🚀 Production API Key Management

When deploying to production:

1. **Never commit your API key** - It's in `.gitignore` for a reason
2. **Use environment variables** - Set `VITE_OPENROUTER_API_KEY` on your hosting platform
3. **Keep api key private** - Don't share with anyone else

**For detailed production deployment instructions**, see [PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md)

Steps vary by platform (Vercel, Netlify, Docker, etc.) - check that file for your specific setup.

---

## Key Limits (Free Tier)

- **Requests per minute**: 60
- **Tokens per day**: 1,000,000
- **File size**: No practical limit in app (OpenRouter handles large datasets efficiently)

---

## Next Steps

1. ✅ Start dev server: `npm run dev`
2. ✅ Set OpenRouter API key
3. ✅ Upload CSV
4. ✅ View analysis
5. ✅ Download report

---

**Need Help?**
- Check README.md for detailed documentation
- Review sample-tickets.csv for CSV format
- Visit [OpenRouter.ai/keys](https://openrouter.ai/keys) for API key management

Happy analyzing! 🚀
