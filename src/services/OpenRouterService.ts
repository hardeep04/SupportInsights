/**
 * OpenRouter API Service for Support Insights Analysis
 * 
 * HYBRID APPROACH: Uses local JavaScript for heavy lifting (filtering, counting, categorizing)
 * and only sends one optimized prompt to OpenRouter for executive summary and patterns.
 * OpenRouter is FREE and supports multiple AI models!
 */

import { GeminiAnalysisResponse, IssueCategory, Ticket, getDaysSinceDate, mergeCategory } from '../types';

interface OpenRouterMessage {
  role: 'user' | 'assistant';
  content: string;
}

class OpenRouterService {
  private apiKey: string | null = null;
  private baseUrl = 'https://openrouter.ai/api/v1/chat/completions';

  constructor(apiKey?: string) {
    if (apiKey) {
      this.apiKey = apiKey;
    }
  }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  /**
   * Determine if a ticket is unresolved based on status
   * Matches the HTML code logic: only 'open' or 'in progress' are considered unresolved
   */
  private isUnresolved(ticket: Ticket): boolean {
    const normalizedStatus = (ticket.status || '').trim().toLowerCase();
    return normalizedStatus === 'open' || normalizedStatus === 'in progress';
  }

  /**
   * LOCAL PROCESSING: Calculate top issues without API
   * Merges related categories for cleaner reporting
   */
  private calculateTopIssues(tickets: Ticket[]): IssueCategory[] {
    const categoryMap: Record<string, number> = {};
    
    tickets.forEach(ticket => {
      const category = ticket.category || 'Uncategorized';
      // Merge related categories (with Wrong/Missing merging enabled)
      const mergedCategory = mergeCategory(category, true);
      categoryMap[mergedCategory] = (categoryMap[mergedCategory] || 0) + 1;
    });

    const total = tickets.length;
    const issues = Object.entries(categoryMap)
      .map(([name, count]) => ({
        name,
        count,
        percentage: (count / total) * 100,
        severity: this.calculateSeverity(count / total),
      }))
      .sort((a, b) => b.count - a.count);

    return issues;
  }

  /**
   * Calculate severity based on percentage
   */
  private calculateSeverity(percentage: number): 'low' | 'medium' | 'high' | 'critical' {
    if (percentage > 0.3) return 'critical';
    if (percentage > 0.15) return 'high';
    if (percentage > 0.05) return 'medium';
    return 'low';
  }

  /**
   * LOCAL PROCESSING: Get unresolved tickets without API
   */
  private getUnresolvedTickets(tickets: Ticket[]) {
    return tickets
      .filter(t => this.isUnresolved(t))
      .map(t => ({
        id: t.id,
        status: t.status,
        reason: this.getStuckReason(t),
        daysSinceUpdate: getDaysSinceDate(t.lastUpdatedDate),
      }))
      .sort((a, b) => a.id.localeCompare(b.id));
  }

  /**
   * LOCAL PROCESSING: Determine why a ticket is stuck
   */
  private getStuckReason(ticket: Ticket): string {
    const desc = (ticket.description || '').toLowerCase();
    const cat = (ticket.category || '').toLowerCase();

    if (!ticket.status || ticket.status.trim() === '') {
      return 'No status set — invisible in queue';
    }
    if (cat.includes('refund')) {
      return 'Refund not processed — Finance bottleneck';
    }
    if (cat.includes('replacement')) {
      return 'Replacement approved but not shipped';
    }
    if (cat.includes('delivery') || cat.includes('shipping')) {
      return 'Awaiting courier update — logistics escalation needed';
    }
    if (cat.includes('damaged')) {
      return 'Awaiting return pickup before replacement';
    }
    if (cat.includes('wrong') || cat.includes('missing')) {
      return 'Correct item resend pending';
    }
    if (cat.includes('quality') || cat.includes('defect')) {
      return 'Escalation to QC team pending';
    }
    if (desc.includes('authentic') || desc.includes('duplicate')) {
      return 'Authenticity concern — supplier verification needed';
    }
    if ((ticket.priority || '').toLowerCase() === 'high') {
      return 'High priority with no resolution — SLA breach imminent';
    }
    return 'Awaiting agent action — no update';
  }

  /**
   * OPTIMIZED PROMPT: Send only essential data to OpenRouter
   */
  private prepareOptimizedPrompt(tickets: Ticket[]): string {
    const unresolvedTickets = tickets.filter(t => this.isUnresolved(t));
    const topIssues = this.calculateTopIssues(tickets);
    const productMap: Record<string, number> = {};

    tickets.forEach(t => {
      if (t.title) {
        productMap[t.title] = (productMap[t.title] || 0) + 1;
      }
    });

    const topProducts = Object.entries(productMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => `${name} (${count} complaints)`)
      .join(', ');

    return `Support Ticket Analysis Summary:
- Total: ${tickets.length} tickets
- Unresolved: ${unresolvedTickets.length} (${((unresolvedTickets.length / tickets.length) * 100).toFixed(1)}%)
- Top Issue Categories: ${topIssues.slice(0, 3).map(i => `${i.name} (${i.count})`).join(', ')}
- Top Problem Products: ${topProducts || 'None flagged'}

Provide:
1. A 5-point executive summary for this week's support queue - format each point as a separate line starting with a dash (-)
2. 2-3 key patterns/trends and recommendations`;
  }

  /**
   * MAIN ANALYSIS - HYBRID APPROACH (with OpenRouter)
   * 1. Process all data locally (no API calls)
   * 2. Send ONE optimized prompt to OpenRouter for insights
   * Result: FREE and unlimited analysis with multiple AI models!
   */
  async analyzeTickets(tickets: Ticket[]): Promise<GeminiAnalysisResponse> {
    if (!this.apiKey) {
      throw new Error('API Key not set. Please provide a valid OpenRouter API key from https://openrouter.ai/');
    }

    try {
      // STEP 1: LOCAL PROCESSING - No API calls needed
      const topIssues = this.calculateTopIssues(tickets);
      const unresolvedTickets = this.getUnresolvedTickets(tickets);

      // STEP 2: Send ONE optimized prompt to OpenRouter
      const optimizedPrompt = this.prepareOptimizedPrompt(tickets);

      const messages: OpenRouterMessage[] = [
        {
          role: 'user',
          content: `${optimizedPrompt}\n\nRespond as JSON: {"summary": "- Point 1\\n- Point 2\\n- Point 3\\n- Point 4\\n- Point 5", "patterns": [{"pattern": "...", "impact": "...", "recommendation": "..."}]}`,
        },
      ];

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': 'https://cubelelo-support-insights.app',
          'X-Title': 'Cubelelo Support Insights',
        },
        body: JSON.stringify({
          model: 'openrouter/auto', // Uses the most cost-effective model available
          messages,
          temperature: 0.3,
          max_tokens: 1024,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `OpenRouter API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`
        );
      }

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content;

      if (!aiResponse) {
        throw new Error('No response from OpenRouter API');
      }

      // STEP 3: Parse the JSON response
      let jsonStr = aiResponse;
      if (jsonStr.includes('```json')) {
        jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (jsonStr.includes('```')) {
        jsonStr = jsonStr.replace(/```\n?/g, '');
      }
      jsonStr = jsonStr.trim();

      const parsedResponse = JSON.parse(jsonStr);

      // STEP 4: Combine local data + AI insights
      return {
        executiveSummary: parsedResponse.summary || 'Support queue analysis complete.',
        topIssues,
        unresolvedTickets,
        keyPatterns: parsedResponse.patterns || [],
      };
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(`Failed to parse OpenRouter response: ${error.message}`);
      }
      if (error instanceof Error) {
        throw new Error(`Analysis failed: ${error.message}`);
      }
      throw new Error('An unexpected error occurred during analysis');
    }
  }

  /**
   * Validate API key with a simple test
   */
  async validateApiKey(): Promise<boolean> {
    if (!this.apiKey) {
      return false;
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': 'https://cubelelo-support-insights.app',
          'X-Title': 'Cubelelo Support Insights',
        },
        body: JSON.stringify({
          model: 'openrouter/auto',
          messages: [{ role: 'user', content: 'test' }],
          max_tokens: 10,
        }),
      });

      return response.ok;
    } catch {
      return false;
    }
  }
}

export default new OpenRouterService();
