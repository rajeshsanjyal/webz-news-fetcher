import axios from 'axios';
import { Logger } from 'winston';
import { WebzPost } from '../types/Post';
import { WebzQueryBuilder } from './WebzQueryBuilder';

interface WebzResponse {
  posts: WebzPost[];
  moreResultsAvailable: boolean;
  next?: string;
  totalResults: number;
}

export class WebzService {
  constructor(private logger: Logger, private token: string) {}

  async fetchAllPosts(query: string): Promise<{ posts: WebzPost[]; totalResults: number }> {
    const token = process.env.WEBZ_API_TOKEN;
    if (!token) {
      throw new Error('API token is missing!');
    }
    let posts: WebzPost[] = [];
    let next: string | undefined = undefined;
    let totalResults = 0;
    let hasMore = true;

    while (hasMore) {
      const url:string = new WebzQueryBuilder(this.token)
        .setQuery(query)
        // .setNext(next || '') --removed for testing
        .build();
    console.log('URL:', url);
      try {
        const res = await axios.get<WebzResponse>(url);
        const { posts: chunk, moreResultsAvailable, next: nextToken, totalResults: total } = res.data;
        posts = posts.concat(chunk);
        // hasMore = moreResultsAvailable; --removed for testing
        hasMore = false; //--added for testing
        next = nextToken;
        if (totalResults === 0) totalResults = total;
      } catch (err: any) {
        this.logger.error('Fetch error', { message: err.message });
        throw err;
      }
    }

    return { posts, totalResults };
  }
}
