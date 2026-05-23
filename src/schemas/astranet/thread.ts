import z from 'zod';

import { ShortProfileSchema } from './users';
import { SegmentEnum } from '../usable';

export const ThreadSchema = z.object({
  threadId: z.string(),
  alertOption: z.number().optional(),
  author: ShortProfileSchema,
  condition: z.number().optional(),
  content: z.string(),
  createdTime: z.string(),
  extensions: z.object({
    coHosts: z.array(z.any()).optional(),
    language: SegmentEnum,
    membersCanInvite: z.boolean(),
  }),
  icon: z.string().optional(),
  isPinned: z.boolean(),
  lastReadTime: z.string(),
  latestActivityTime: z.string(),
  membersCount: z.number(),
  mentionCount: z.number(),
  modifiedTime: z.string(),
  ndcId: z.number(),
  status: z.number(),
  title: z.string(),
  type: z.number(),
  unreadCount: z.number(),
});

export type Thread = z.infer<typeof ThreadSchema>;
