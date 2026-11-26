import type { LinkedIssue } from '@core/primitives/linked-issues/api';

type ResolveTaskBranchNameInput = {
  rawBranch: string;
  branchPrefix: string;
  suffix: string;
  appendRandomSuffix: boolean;
  linkedIssue?: LinkedIssue;
  disableRandomSuffix?: boolean;
};

export function resolveTaskBranchName({
  rawBranch,
  branchPrefix,
  suffix,
  appendRandomSuffix,
  linkedIssue,
  disableRandomSuffix = false,
}: ResolveTaskBranchNameInput): string {
  const linearBranchName =
    linkedIssue?.provider === 'linear' ? linkedIssue.branchName?.trim() : undefined;

  if (linearBranchName) {
    return linearBranchName;
  }

  if (linkedIssue?.provider === 'asana' && linkedIssue.branchName?.trim() && rawBranch) {
    return branchPrefix ? `${branchPrefix}/${rawBranch}` : rawBranch;
  }

  const shouldAppendSuffix =
    appendRandomSuffix && !disableRandomSuffix && linkedIssue?.provider !== 'linear';
  const branch = shouldAppendSuffix ? `${rawBranch}-${suffix}` : rawBranch;
  return branchPrefix ? `${branchPrefix}/${branch}` : branch;
}
