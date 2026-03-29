import React, { useMemo } from 'react';
import { IssueCategory, KeyPattern, UnresolvedTicket } from '../types/index';

export interface ActionItem {
  id: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: 'immediate' | 'preventive' | 'strategic';
  title: string;
  description: string;
  actionSteps: string[];
  owner: string;
  timeline: string;
  impact: string;
  relatedIssue?: string;
}

interface PlanOfActionProps {
  topIssues: IssueCategory[];
  unresolvedTickets: UnresolvedTicket[];
  patterns: KeyPattern[];
  isLoading?: boolean;
}

const getPriorityTag = (priority: string) => {
  switch (priority) {
    case 'critical':
      return { label: 'Critical', color: 'bg-red-100 text-red-700', border: 'border-red-200' };
    case 'high':
      return { label: 'High', color: 'bg-orange-100 text-orange-700', border: 'border-orange-200' };
    case 'medium':
      return { label: 'Medium', color: 'bg-amber-100 text-amber-700', border: 'border-amber-200' };
    case 'low':
      return { label: 'Low', color: 'bg-sky-100 text-sky-700', border: 'border-sky-200' };
    default:
      return { label: 'Unknown', color: 'bg-slate-100 text-slate-700', border: 'border-slate-200' };
  }
};

const PlanOfAction: React.FC<PlanOfActionProps> = ({
  topIssues,
  unresolvedTickets,
  patterns,
  isLoading = false,
}) => {
  const actionPlan = useMemo<ActionItem[]>(() => {
    const actions: ActionItem[] = [];
    let actionId = 1;

    const criticalStuck = unresolvedTickets.filter((t) => t.daysSinceUpdate > 7).slice(0, 4);
    if (criticalStuck.length) {
      actions.push({
        id: `immediate-${actionId++}`,
        priority: 'critical',
        category: 'immediate',
        title: 'Escalate Substantially overdue tickets',
        description: `There are ${criticalStuck.length} tickets pending longer than 7 days. Execute immediate resolution workflows.`,
        actionSteps: criticalStuck.map((t) => `Reassign ${t.id} and update status`),
        owner: 'Support Lead',
        timeline: '24 hours',
        impact: 'Reduce SLA breach risk',
      });
    }

    const urgentIssues = topIssues.filter((issue) => issue.severity === 'critical' || issue.severity === 'high').slice(0, 4);
    urgentIssues.forEach((issue) => {
      actions.push({
        id: `preventive-${actionId++}`,
        priority: issue.severity === 'critical' ? 'critical' : 'high',
        category: 'preventive',
        title: `Root Cause Review: ${issue.name}`,
        description: `Target ${issue.count} tickets that are driving ${issue.percentage}% of workload`,
        actionSteps: ['Assess root cause', 'Align stakeholders', 'Create delivery plan'],
        owner: 'Ops Manager',
        timeline: '2 days',
        impact: 'Increase workflow stability',
        relatedIssue: issue.name,
      });
    });

    patterns.slice(0, 3).forEach((pattern) => {
      actions.push({
        id: `strategic-${actionId++}`,
        priority: 'medium',
        category: 'strategic',
        title: `Strategic initiative: ${pattern.pattern}`,
        description: pattern.impact,
        actionSteps: [pattern.recommendation, 'Measure progress weekly', 'Publish retrospective'],
        owner: 'Strategy Lead',
        timeline: '7 days',
        impact: pattern.recommendation,
      });
    });

    if (actions.length < 4) {
      actions.push({
        id: `strategic-${actionId++}`,
        priority: 'low',
        category: 'strategic',
        title: 'Process optimization backlog',
        description: 'Complete scalable support process hygiene improvements',
        actionSteps: ['Review current SOPs', 'Identify automation targets', 'Document interim changes'],
        owner: 'Support Operations',
        timeline: 'ongoing',
        impact: 'Improve throughput',
      });
    }

    return actions;
  }, [topIssues, unresolvedTickets, patterns]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Preparing next actions... please wait.</p>
      </div>
    );
  }

  const totalActions = actionPlan.length;
  const critical = actionPlan.filter((s) => s.priority === 'critical').length;
  const high = actionPlan.filter((s) => s.priority === 'high').length;
  const medium = actionPlan.filter((s) => s.priority === 'medium').length;

  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Plan of Action</h1>
            <p className="text-sm text-slate-500">AI prioritized action list with impact-driven tasks.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 border border-sky-100">Total {totalActions}</span>
            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 border border-red-100">Critical {critical}</span>
            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700 border border-orange-100">High {high}</span>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-100">Medium {medium}</span>
          </div>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {actionPlan.map((action, index) => {
            const tag = getPriorityTag(action.priority);
            return (
              <article key={action.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{action.category}</p>
                    <h2 className="mt-1 text-lg font-bold text-slate-900">{action.title}</h2>
                  </div>
                  <span className="text-xs text-slate-400">#{index + 1}</span>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-600">{action.description}</p>

                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <div className="rounded-lg border border-slate-100 bg-slate-50 p-2">
                    <p className="text-[10px] font-semibold uppercase text-slate-500">Owner</p>
                    <p className="text-sm text-slate-700">{action.owner}</p>
                  </div>
                  <div className="rounded-lg border border-slate-100 bg-slate-50 p-2">
                    <p className="text-[10px] font-semibold uppercase text-slate-500">Timeline</p>
                    <p className="text-sm text-slate-700">{action.timeline}</p>
                  </div>
                  <div className="rounded-lg border border-slate-100 bg-slate-50 p-2">
                    <p className="text-[10px] font-semibold uppercase text-slate-500">Impact</p>
                    <p className="text-sm text-slate-700 truncate">{action.impact}</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-1 text-sm">
                  {action.actionSteps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-start gap-3">
                      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-600 text-[10px] font-semibold text-white">{stepIndex + 1}</span>
                      <p className="text-slate-600 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                  <span className={`rounded-full px-2 py-1 font-semibold border ${tag.color} ${tag.border}`}>{tag.label}</span>
                  {action.relatedIssue && <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-500">Related {action.relatedIssue}</span>}
                </div>
              </article>
            );
          })}
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">Severity Summary</h3>
            <div className="mt-3 space-y-2 text-xs text-slate-600">
              <p>Critical: {critical}</p>
              <p>High: {high}</p>
              <p>Medium: {medium}</p>
              <p>Low: {actionPlan.filter((x) => x.priority === 'low').length}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">Quick Reference</h3>
            <ul className="mt-2 list-disc pl-5 text-sm text-slate-600 space-y-1">
              <li>Immediate: focus on {'>'} 24 hr SLA risk</li>
              <li>Preventive: fix root cause deviations</li>
              <li>Strategic: optimize process for next quarter</li>
              <li>Review cadence: weekly + bi-weekly</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default PlanOfAction;
