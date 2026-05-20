import z from 'zod';

import { ShortProfileSchema } from './users';
import { MediaListSchema } from './media-list';

export const CommentSchema = z.object({
  author: ShortProfileSchema,
  commentId: z.string(),
  content: z.string(),
  createdTime: z.string(),
  modifiedTime: z.string(),
  ndcId: z.number(),
  parentId: z.string(),
  parentType: z.number(),
  subcommentsCount: z.number(),
  type: z.number(),
  votesCount: z.number(),
  mediaList: z.array(MediaListSchema).optional(),
});

export type Comment = z.infer<typeof CommentSchema>;
