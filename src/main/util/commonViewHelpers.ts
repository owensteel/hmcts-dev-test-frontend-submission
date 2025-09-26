import {
  getAllTaskStatusesWithUserFriendlyLabel,
  getStatusTagClass,
  getStatusUserFriendlyLabel,
} from './taskViewHelpers';

export interface NunjucksSelectorOption {
  // Based on Nunjucks
  value: string;
  text: string;
  selected: boolean;
}

export function generateTaskStatusSelectorOptions(selectedStatus?: string): NunjucksSelectorOption[] {
  const taskStatusSelectorOptions = [];
  for (const status of getAllTaskStatusesWithUserFriendlyLabel()) {
    taskStatusSelectorOptions.push({
      value: status,
      text: getStatusUserFriendlyLabel(status),
      selected: selectedStatus === status,
    });
  }
  return taskStatusSelectorOptions;
}

// GOV UK components generated server-side due to Nunjucks issues

export function htmlGovUK_tagForStatus(taskStatus: string): string {
  return `<strong class="govuk-tag ${getStatusTagClass(taskStatus)}">${getStatusUserFriendlyLabel(taskStatus)}</strong>`;
}

export function htmlGovUK_summaryListActionsList(
  actions: {
    text: string;
    href: string;
    visuallyHidden: string;
  }[]
): string {
  let element = '<ul class="govuk-summary-list__actions-list">';
  for (const action of actions) {
    element += `
        <li class="govuk-summary-list__actions-list-item">
            <a class="govuk-link" href="${action.href}">
                ${action.text}
                <span class="govuk-visually-hidden">${action.visuallyHidden}</span>
            </a>
        </li>
    `;
  }
  element += '</ul>';
  return element;
}
