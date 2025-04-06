import express from 'express';
import { PostController } from '../controllers/PostController';
import { WebzService } from '../services/WebzService';
import { PostModel } from '../models/PostModel';
import { db } from '../config/database';
import { logger } from '../utils/logger';

const router = express.Router();

const webzService = new WebzService(logger, process.env.WEBZ_API_TOKEN as string);
const postModel = new PostModel(db);
const controller = new PostController(webzService, postModel, logger);

router.get('/fetch-posts', controller.fetchAndStorePosts);

export default router;