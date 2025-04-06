import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Logger } from 'winston';
import { WebzService } from '../../services/WebzService';
import { WebzQueryBuilder } from '../../services/WebzQueryBuilder';

jest.mock('../../services/WebzQueryBuilder');

describe('WebzService', () => {
  const mockLogger: Logger = {
    error: jest.fn(),
  } as unknown as Logger;

  const token = 'dummy-token';
  let service: WebzService;
  let mockAxios: MockAdapter;

  beforeEach(() => {
    process.env.WEBZ_API_TOKEN = token;
    service = new WebzService(mockLogger, token);
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.restore();
    jest.clearAllMocks();
  });

  it('fetches all paginated posts successfully', async () => {
    const query = 'technology';

    const response1 = {
      posts: [
        {
          uuid: 'uuid-1',
          title: 'Post 1',
          text: 'Post 1 text',
          published: '2024-01-01T00:00:00Z',
          url: 'http://example.com/post1',
        },
      ],
      moreResultsAvailable: true,
      next: 'next-token',
      totalResults: 2,
    };

    const response2 = {
      posts: [
        {
          uuid: 'uuid-2',
          title: 'Post 2',
          text: 'Post 2 text',
          published: '2024-01-02T00:00:00Z',
          url: 'http://example.com/post2',
        },
      ],
      moreResultsAvailable: false,
      totalResults: 2,
    };

    // Simulate different URLs for each page of results
    const urls = ['url1', 'url2'];

    // Mock WebzQueryBuilder to return different URLs for each request
    (WebzQueryBuilder as jest.Mock).mockImplementationOnce(() => ({
      setQuery: jest.fn().mockReturnThis(),
      setNext: jest.fn().mockReturnThis(),
      build: jest.fn().mockReturnValue(urls[0]),
    })).mockImplementationOnce(() => ({
      setQuery: jest.fn().mockReturnThis(),
      setNext: jest.fn().mockReturnThis(),
      build: jest.fn().mockReturnValue(urls[1]),
    }));

    // Mock axios responses for the two URLs
    mockAxios.onGet(urls[0]).reply(200, response1);
    mockAxios.onGet(urls[1]).reply(200, response2);

    // Call the service method
    const result = await service.fetchAllPosts(query);

    // Assertions
    expect(result.totalResults).toBe(2);
    expect(result.posts.length).toBe(2);
    expect(result.posts[0].uuid).toBe('uuid-1');
    expect(result.posts[1].uuid).toBe('uuid-2');
    expect(mockAxios.history.get.length).toBe(2); // Ensure 2 requests were made
  });
});
