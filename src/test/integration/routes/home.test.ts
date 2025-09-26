import { app } from '../../../main/app';
import { Case } from '../../../models/Case';
import { ApiClient } from '../../../services/ApiClient';

import request from 'supertest';

// Mock the whole ApiClient class
jest.mock('../../../services/ApiClient');

const mockedApiClient = ApiClient as jest.MockedClass<typeof ApiClient>;

const fakeCaseData: Case = {
  id: 1,
  caseNumber: 'ABC12345',
  title: 'Case Title',
  description: 'Case description',
  status: 'Case Status',
  createdDate: new Date().toISOString(),
  createdAt: '',
};

describe('Home page', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    // Fake implementation for getCase
    mockedApiClient.prototype.getExampleCase.mockResolvedValue(fakeCaseData);
  });

  it('GET / should return 200 and render the case page and display case details', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Case details');
    expect(res.text).toContain(fakeCaseData.title);
    expect(res.text).toContain(fakeCaseData.description);
    expect(res.text).toContain(fakeCaseData.status);
    expect(res.text).toContain(fakeCaseData.createdDate);
  });
});
