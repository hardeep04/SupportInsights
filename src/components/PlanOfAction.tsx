import { AlertCircle, ArrowRight, CheckCircle2, Clock, Shield, TrendingUp, Users, Zap } from 'lucide-react';
import React, { useMemo } from 'react';
import { IssueCategory, KeyPattern, UnresolvedTicket } from '../types/index';

export interface ActionItem {
  id: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: 'immediate' | 'preventive' | 'strategic';
  title: string;
  description: string;
  actionSteps: string[];
  owner: string; // Role who should own this
  timeline: string; // e.g., "24 hours", "2-3 days"
  impact: string; // Expected outcome
  relatedIssue?: string;
}

interface PlanOfActionProps {
  topIssues: IssueCategory[];
  unresolvedTickets: UnresolvedTicket[];
  patterns: KeyPattern[];
  isLoading?: boolean;
}

const PlanOfAction: React.FC<PlanOfActionProps> = ({
  topIssues,
  unresolvedTickets,
  patterns,
  isLoading = false,
}) => {
  // Generate action plan based on analysis
  const actionPlan = useMemo<ActionItem[]>(() => {
    const actions: ActionItem[] = [];
    let actionId = 1;

    // CATEGORY 1: IMMEDIATE ACTIONS (Stuck Tickets)
    const criticalStuckTickets = unresolvedTickets
      .filter((t) => t.daysSinceUpdate > 7)
      .slice(0, 3);

    if (criticalStuckTickets.length > 0) {
      actions.push({
        id: `immediate-${actionId++}`,
        priority: 'critical',
        category: 'immediate',
        title: '🚨 Escalate Critical Stuck Tickets',
        description: `${criticalStuckTickets.length} ticket(s) unresolved for 7+ days - requires immediate intervention`,
        actionSteps: [
          `Review ${criticalStuckTickets.length} critical cases: ${criticalStuckTickets
            .map((t) => `#${t.id}`)
            .join(', ')}`,
          'Contact ticket owners/assignees for status update',
          'Remove blockers identified in ticket reasons',
          'Set follow-up meeting if external dependency',
        ],
        owner: 'Support Manager / Team Lead',
        timeline: '2 hours',
        impact: `Resolve customer escalations, prevent SLA breaches`,
      });
    }

    const moderateStuckTickets = unresolvedTickets
      .filter((t) => t.daysSinceUpdate > 3 && t.daysSinceUpdate <= 7)
      .slice(0, 2);

    if (moderateStuckTickets.length > 0) {
      actions.push({
        id: `immediate-${actionId++}`,
        priority: 'high',
        category: 'immediate',
        title: '⚠️ Monitor At-Risk Tickets',
        description: `${moderateStuckTickets.length} ticket(s) at risk status (3-7 days unresolved)`,
        actionSteps: [
          `Identify blockers: ${moderateStuckTickets.map((t) => t.reason).join('; ')}`,
          'Assign dedicated owner to each ticket',
          'Provide necessary resources or escalate',
          'Commit to resolution timeline',
        ],
        owner: 'Support Team Leads',
        timeline: '4 hours',
        impact: 'Prevent tickets from becoming critical, maintain SLA standards',
      });
    }

    // CATEGORY 2: PREVENTIVE ACTIONS (Top Issues)
    const criticalIssues = topIssues.filter((i) => i.severity === 'critical').slice(0, 2);

    if (criticalIssues.length > 0) {
      criticalIssues.forEach((issue) => {
        actions.push({
          id: `preventive-${actionId++}`,
          priority: 'high',
          category: 'preventive',
          title: `📊 Root Cause Analysis: ${issue.name}`,
          description: `Critical issue affecting ${issue.count} tickets (${issue.percentage}% of total) - needs investigation`,
          actionSteps: [
            `Sample 5-10 tickets from "${issue.name}" category`,
            'Interview customers for common pain points',
            'Review internal process for gaps',
            'Document 3-5 root causes',
            'Create action plan by team',
          ],
          owner: 'Product/Operations Manager',
          timeline: '1-2 days',
          impact: `Reduce ${issue.name} issues by 30-50% long-term`,
          relatedIssue: issue.name,
        });
      });
    }

    // CATEGORY 3: STRATEGIC ACTIONS (From KeyPatterns)
    patterns.slice(0, 2).forEach((pattern) => {
      actions.push({
        id: `strategic-${actionId++}`,
        priority: 'medium',
        category: 'strategic',
        title: `🎯 Strategic Fix: ${pattern.pattern}`,
        description: pattern.impact,
        actionSteps: [
          `Implement recommendation: "${pattern.recommendation}"`,
          'Identify resources and budget needed',
          'Create implementation plan with milestones',
          'Set KPIs to measure success',
          'Schedule review after 2 weeks',
        ],
        owner: 'Manager / Team Lead',
        timeline: '3-5 days',
        impact: pattern.recommendation,
      });
    });

    // If no high-priority issues, add general best practices
    if (actions.length < 4) {
      actions.push({
        id: `strategic-${actionId++}`,
        priority: 'medium',
        category: 'strategic',
        title: '✨ Continuous Improvement',
        description: 'Overall support process optimization',
        actionSteps: [
          'Schedule weekly support sync meetings',
          'Track all new issues and categorize them',
          'Update escalation procedures',
          'Create customer feedback loop',
        ],
        owner: 'Support Lead',
        timeline: 'Ongoing',
        impact: 'Systematic process improvement',
      });
    }

    return actions.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [topIssues, unresolvedTickets, patterns]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-900';
      case 'high':
        return 'bg-orange-50 border-orange-200 text-orange-900';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 text-yellow-900';
      case 'low':
        return 'bg-blue-50 border-blue-200 text-blue-900';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'immediate':
        return <Zap className="w-5 h-5 text-red-600" />;
      case 'preventive':
        return <Shield className="w-5 h-5 text-orange-600" />;
      case 'strategic':
        return <TrendingUp className="w-5 h-5 text-blue-600" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-gray-600" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'immediate':
        return 'Immediate Action Required';
      case 'preventive':
        return 'Preventive Investigation';
      case 'strategic':
        return 'Strategic Initiative';
      default:
        return 'Action Item';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="flex items-center justify-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <span className="text-gray-600">Generating action plan...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Zap className="w-6 h-6" />
              Actionable Plan of Action
            </h2>
            <p className="text-indigo-100">
              {actionPlan.length} prioritized actions to resolve issues and improve operations
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{actionPlan.length}</div>
            <div className="text-indigo-100 text-sm">Total Actions</div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-red-900">Critical</span>
          </div>
          <div className="text-2xl font-bold text-red-700">
            {actionPlan.filter((a) => a.priority === 'critical').length}
          </div>
          <div className="text-xs text-red-600">Start immediately</div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-900">High Priority</span>
          </div>
          <div className="text-2xl font-bold text-orange-700">
            {actionPlan.filter((a) => a.priority === 'high').length}
          </div>
          <div className="text-xs text-orange-600">This week</div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-900">Medium</span>
          </div>
          <div className="text-2xl font-bold text-yellow-700">
            {actionPlan.filter((a) => a.priority === 'medium').length}
          </div>
          <div className="text-xs text-yellow-600">Next 1-2 weeks</div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Strategic</span>
          </div>
          <div className="text-2xl font-bold text-blue-700">
            {actionPlan.filter((a) => a.category === 'strategic').length}
          </div>
          <div className="text-xs text-blue-600">Ongoing</div>
        </div>
      </div>

      {/* Action Items */}
      <div className="space-y-4">
        {actionPlan.map((action, index) => (
          <div
            key={action.id}
            className={`border-l-4 rounded-lg p-5 transition-all hover:shadow-md ${getPriorityColor(
              action.priority
            )}`}
            style={{
              borderColor:
                action.priority === 'critical'
                  ? '#dc2626'
                  : action.priority === 'high'
                    ? '#ea580c'
                    : action.priority === 'medium'
                      ? '#ca8a04'
                      : '#2563eb',
            }}
          >
            {/* Action Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="mt-1">{getCategoryIcon(action.category)}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{action.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityBadgeColor(action.priority)}`}>
                      {action.priority.toUpperCase()}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-800 font-medium">
                      {getCategoryLabel(action.category)}
                    </span>
                  </div>
                  <p className="text-sm opacity-90">{action.description}</p>
                </div>
              </div>
              <div className="text-right ml-4">
                <div className="text-2xl font-bold opacity-20">{String(index + 1).padStart(2, '0')}</div>
              </div>
            </div>

            {/* Action Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
              <div>
                <div className="flex items-center gap-1 font-semibold mb-1">
                  <Users className="w-4 h-4" />
                  Owner
                </div>
                <p className="opacity-75">{action.owner}</p>
              </div>

              <div>
                <div className="flex items-center gap-1 font-semibold mb-1">
                  <Clock className="w-4 h-4" />
                  Timeline
                </div>
                <p className="opacity-75">{action.timeline}</p>
              </div>

              <div>
                <div className="flex items-center gap-1 font-semibold mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Expected Impact
                </div>
                <p className="opacity-75 text-xs">{action.impact}</p>
              </div>
            </div>

            {/* Action Steps */}
            <div className="mb-3">
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                Action Steps
              </h4>
              <ol className="space-y-2">
                {action.actionSteps.map((step, stepIndex) => (
                  <li key={stepIndex} className="flex gap-3 text-sm">
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-white bg-opacity-50 font-medium text-xs">
                      {stepIndex + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Related Issue */}
            {action.relatedIssue && (
              <div className="text-xs opacity-75 flex items-center gap-2 pt-2 border-t border-current border-opacity-20">
                <span className="font-semibold">Related Issue:</span>
                <span>{action.relatedIssue}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Success Criteria */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          Success Criteria
        </h3>
        <ul className="space-y-2 text-green-900 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>All critical actions (immediate) completed within 24 hours</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>High-priority items resolved by end of week</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Preventive investigations complete and findings documented</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Re-run analysis in 2 weeks to measure improvement in stuck tickets</span>
          </li>
        </ul>
      </div>

      {/* Quick Reference */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-blue-900 mb-3">📋 Quick Reference</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-900">
          <div>
            <p className="font-semibold mb-1">🚨 Immediate Actions</p>
            <p className="opacity-75">Address within today/tomorrow to prevent escalations</p>
          </div>
          <div>
            <p className="font-semibold mb-1">🛡️ Preventive Actions</p>
            <p className="opacity-75">Root cause analysis to prevent future recurrence</p>
          </div>
          <div>
            <p className="font-semibold mb-1">📈 Strategic Actions</p>
            <p className="opacity-75">Long-term improvements to systems/processes</p>
          </div>
          <div>
            <p className="font-semibold mb-1">📊 Review Schedule</p>
            <p className="opacity-75">Check progress weekly, full re-analysis every 2 weeks</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanOfAction;
