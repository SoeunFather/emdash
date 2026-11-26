import { normalizeTaskName } from '@core/features/tasks/api/browser/taskNames';
import type { LinkedIssue } from '@core/primitives/linked-issues/api';

export function getIssueTaskName(
  issue: LinkedIssue | null | undefined,
  options?: { preserveCapitalization?: boolean }
): string | null {
  if (!issue) {
    return null;
  }

  const branchName = issue.branchName?.trim();
  if (!branchName) {
    return null;
  }

  const normalized = normalizeTaskName(branchName.replace(/\//g, '-'), options);
  return normalized || null;
}

export function getAsanaSessionName(issue: LinkedIssue | null, column: string) {
  if (issue?.provider !== 'asana' || !column.trim()) return undefined;
  return (
    issue.customFields?.find((field) => field.name === column.trim())?.value.trim() || undefined
  );
}

export function getAsanaWorktreeName(issue: LinkedIssue, displayName: string): string {
  return getIssueTaskName(issue) ?? (normalizeTaskName(displayName) || `asana-${issue.identifier}`);
}
