import { generateTaskStatusSelectorOptions, htmlGovUK_tagForStatus } from '../../../main/util/commonViewHelpers';
import { TaskStatus } from '../../../models/TaskStatus';

describe('commonViewHelpers', () => {
  describe('generateTaskStatusSelectorOptions', () => {
    it('should generate options for all TaskStatus values', () => {
      const options = generateTaskStatusSelectorOptions();

      // It should include all regular TaskStatus values
      expect(options).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ value: TaskStatus.DONE }),
          expect.objectContaining({ value: TaskStatus.IN_PROGRESS }),
          expect.objectContaining({ value: TaskStatus.PENDING }),
          expect.objectContaining({ value: TaskStatus.BLOCKED }),
        ])
      );
    });

    it('should mark the correct status as selected', () => {
      const options = generateTaskStatusSelectorOptions(TaskStatus.DONE);

      const selected = options.find(opt => opt.selected);
      expect(selected?.value).toBe(TaskStatus.DONE);
    });
  });

  describe('htmlGovUK_tagForStatus', () => {
    it('should return the correct tag HTML for DONE', () => {
      const html = htmlGovUK_tagForStatus(TaskStatus.DONE);
      expect(html).toContain('govuk-tag--green');
      expect(html).toContain('Done');
    });

    it('should return the correct tag HTML for BLOCKED', () => {
      const html = htmlGovUK_tagForStatus(TaskStatus.BLOCKED);
      expect(html).toContain('govuk-tag--red');
      expect(html).toContain('Blocked');
    });

    it('should fall back gracefully for unknown status', () => {
      const html = htmlGovUK_tagForStatus('UNKNOWN');
      expect(html).toContain('govuk-tag');
    });
  });
});
