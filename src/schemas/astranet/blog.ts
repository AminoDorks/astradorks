import z from 'zod';

import { ShortProfileSchema } from './users';
import { MediaListSchema } from './media-list';

export const BlogSchema = z.object({
  author: ShortProfileSchema,
  blogId: z.string(),
  commentsCount: z.number(),
  content: z.string(),
  createdTime: z.string(),
  extensions: z
    .object({
      backgroundMediaList: z.array(MediaListSchema).optional(),
    })
    .optional(),
  isFeatured: z.boolean(),
  mediaList: z.array(MediaListSchema).nullable(),
  status: z.number(),
  title: z.string(),
  uid: z.string(),
  modifiedTime: z.string(),
  ndcId: z.number(),
  type: z.number(),
  votesCount: z.number(),
});

export type Blog = z.infer<typeof BlogSchema>;
