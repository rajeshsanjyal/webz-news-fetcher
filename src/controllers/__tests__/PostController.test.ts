import { PostModel } from '../../models/PostModel';
import { WebzPost } from '../../types/Post';
import { Client } from 'pg';

// Mock the 'pg' Client
jest.mock('pg', () => {
  return {
    Client: jest.fn().mockImplementation(() => ({
      query: jest.fn(),
    })),
  };
});

describe('PostModel', () => {
  let mockDb: jest.Mocked<Client>; // Correctly type it as a mocked Client
  let postModel: PostModel;

  beforeEach(() => {
    mockDb = new Client() as jest.Mocked<Client>; // Mock the Client type
    postModel = new PostModel(mockDb);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should insert posts into the database', async () => {
    const mockPosts: WebzPost[] = [
      {
        uuid: 'uuid-1',
        title: 'Post 1',
        text: 'Post 1 text',
        published: '2024-01-01T00:00:00Z',
        url: 'http://example.com/post1',
      },
      {
        uuid: 'uuid-2',
        title: 'Post 2',
        text: 'Post 2 text',
        published: '2024-01-02T00:00:00Z',
        url: 'http://example.com/post2',
      },
    ];

    // Mock successful query execution
    (mockDb.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

    await postModel.insertPosts(mockPosts);

    // Check that the query method was called for each post
    expect(mockDb.query).toHaveBeenCalledTimes(mockPosts.length);
    mockPosts.forEach((post, index) => {
      expect(mockDb.query).toHaveBeenCalledWith(
        'INSERT INTO posts (title, text, published, url) VALUES ($1, $2, $3, $4)',
        [post.title, post.text, post.published, post.url]
      );
    });
  });

  it('should throw an error if the database query fails', async () => {
    const mockPosts: WebzPost[] = [
      {
        uuid: 'uuid-1',
        title: 'Post 1',
        text: 'Post 1 text',
        published: '2024-01-01T00:00:00Z',
        url: 'http://example.com/post1',
      },
    ];

    // Simulate a database error
    (mockDb.query as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

    await expect(postModel.insertPosts(mockPosts)).rejects.toThrow('Database error');
  });
});
