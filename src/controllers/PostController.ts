import { Request, Response } from 'express';
import { WebzService } from '../services/WebzService';
import { PostModel } from '../models/PostModel';
import { Logger } from 'winston';

export class PostController {
  constructor(
    private webzService: WebzService,
    private postModel: PostModel,
    private logger: Logger
  ) {}

  fetchAndStorePosts = async (req: Request, res: Response) => {
    const query = req.query.q as string || 'technology';

    try {
      const { posts, totalResults } = await this.webzService.fetchAllPosts(query);
      await this.postModel.insertPosts(posts);

      const remaining = totalResults - posts.length;

      res.json({
        message: 'Posts saved successfully',
        retrievedCount: posts.length,
        remainingCount: remaining,
      });
    } catch (err: any) {
      this.logger.error('Controller error', { message: err.message });
      res.status(500).json({ error: 'Failed to fetch or save posts' });
    }
  };
}
