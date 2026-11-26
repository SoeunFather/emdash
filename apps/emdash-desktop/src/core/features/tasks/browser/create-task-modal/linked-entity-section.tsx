import { Button, Input, ToggleGroup } from '@emdash/ui/react/primitives';
import { IssueComboboxField } from './issue-combobox-field';
import { PrComboboxField } from './pr-combobox-field';
import type { LinkedType, CreateTaskState } from './use-create-task-state';

interface LinkedEntitySectionProps {
  state: CreateTaskState;
  hasAnyIssueIntegration: boolean;
  hasPrSupport: boolean;
  requestProvider?: string;
  issueProvider?: string | null;
  issueLabel: string;
  projectId?: string;
  repositoryUrl?: string;
  projectPath?: string;
}

export function LinkedEntitySection({
  state,
  hasAnyIssueIntegration,
  hasPrSupport,
  requestProvider,
  issueProvider,
  issueLabel,
  projectId,
  repositoryUrl,
  projectPath,
}: LinkedEntitySectionProps) {
  return (
    <div className="flex w-full flex-col justify-between overflow-hidden rounded-lg border">
      <div
        className={`flex w-full items-center justify-between gap-2 px-2 py-1 ${state.linkedType ? 'border-b' : ''}`}
      >
        <span className="shrink-0 text-sm text-foreground-muted">Based on</span>
        <ToggleGroup.Root
          className="bg-transparent"
          value={state.linkedType ? [state.linkedType] : []}
          onValueChange={([v]) => {
            state.setLinkedType((v as LinkedType) ?? null);
          }}
        >
          <ToggleGroup.Item className="text-xs" value="issue" disabled={!hasAnyIssueIntegration}>
            {issueLabel}
          </ToggleGroup.Item>
          <ToggleGroup.Item className="text-xs" value="pr" disabled={!hasPrSupport}>
            {requestProvider === 'gitlab' ? 'Merge Request' : 'Pull Request'}
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>
      {state.linkedType === 'issue' && (
        <>
          <IssueComboboxField
            value={state.linkedIssue}
            onValueChange={state.setLinkedIssue}
            projectId={projectId}
            repositoryUrl={repositoryUrl}
            projectPath={projectPath}
          />
          {(state.linkedIssue?.provider ?? issueProvider) === 'asana' && (
            <label className="flex flex-col gap-1 border-t px-3 py-2 text-xs">
              Asana column for session name
              <Input
                value={state.asanaColumn}
                placeholder="Optional · e.g. Ticket ID"
                onChange={(event) => state.setAsanaColumn(event.target.value)}
              />
              {state.linkedIssue && state.asanaColumn.trim() && !state.asanaName && (
                <span className="text-foreground-muted">No matching value. Using the usual task name.</span>
              )}
            </label>
          )}
          {state.issueContextPending && (
            <p role="status" className="px-3 pb-2 text-xs text-foreground-muted">
              Loading ticket context…
            </p>
          )}
          {state.issueContextError && (
            <div role="alert" className="flex items-center gap-2 px-3 pb-2 text-xs">
              <span>{state.issueContextError}</span>
              <Button type="button" variant="link" size="sm" onClick={state.retryIssueContext}>
                Retry
              </Button>
            </div>
          )}
        </>
      )}
      {state.linkedType === 'pr' && (
        <PrComboboxField
          provider={requestProvider}
          value={state.linkedPR}
          onValueChange={state.setLinkedPR}
          projectId={projectId}
          repositoryUrl={repositoryUrl}
        />
      )}
    </div>
  );
}
