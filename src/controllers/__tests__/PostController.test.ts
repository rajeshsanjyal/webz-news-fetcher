import { PostController } from '../../controllers/PostController';
import { WebzService } from '../../services/WebzService';
import { PostModel } from '../../models/PostModel';
import { Logger } from 'winston';
import { Request, Response } from 'express';

describe('PostController', () => {
  let controller: PostController;
  let mockWebzService: jest.Mocked<WebzService>;
  let mockPostModel: jest.Mocked<PostModel>;
  let mockLogger: jest.Mocked<Logger>;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockWebzService = {
      fetchAllPosts: jest.fn(),
    } as unknown as jest.Mocked<WebzService>;

    mockPostModel = {
      insertPosts: jest.fn(),
    } as unknown as jest.Mocked<PostModel>;

    mockLogger = {
      error: jest.fn(),
    } as unknown as jest.Mocked<Logger>;

    controller = new PostController(mockWebzService, mockPostModel, mockLogger);

    mockReq = {
      query: {},
    };

    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and save posts and respond with success message', async () => {
    const mockPosts = [
      {
        uuid: 'uuid-1',
        title: 'Title 1',
        text: 'Text 1',
        published: '2024-01-01T00:00:00Z',
        url: 'http://example.com/1',
      },
    ];

    mockWebzService.fetchAllPosts.mockResolvedValue({
      posts: mockPosts,
      totalResults: 5,
    });

    mockPostModel.insertPosts.mockResolvedValue(undefined);

    await controller.fetchAndStorePosts(
      mockReq as Request,
      mockRes as Response
    );

    expect(mockWebzService.fetchAllPosts).toHaveBeenCalledWith('technology');
    expect(mockPostModel.insertPosts).toHaveBeenCalledWith(mockPosts);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Posts saved successfully',
      retrievedCount: 1,
      remainingCount: 4,
    });
  });

  it('should handle errors and respond with 500', async () => {
    const error = new Error('Service failed');

    mockWebzService.fetchAllPosts.mockRejectedValue(error);

    await controller.fetchAndStorePosts(
      mockReq as Request,
      mockRes as Response
    );

    expect(mockLogger.error).toHaveBeenCalledWith('Controller error', {
      message: error.message,
    });
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Failed to fetch or save posts',
    });
  });
});
