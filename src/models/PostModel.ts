import { WebzPost } from '../types/Post';
import { Client } from 'pg';

export class PostModel {
  constructor(private db: Client) {}

  async insertPosts(posts: WebzPost[]): Promise<void> {
    const query = 'INSERT INTO posts (uuid, title, text, published, url) VALUES ($1, $2, $3, $4, $5)';
    for (const post of posts) {
        console.log('Inserting posttitle:', post.title);
      const values = [post.uuid, post.title, post.text, post.published, post.url];
      await this.db.query(query, values);
    }
  }
}