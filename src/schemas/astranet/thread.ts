import z from 'zod';

import { ShortProfileSchema } from './users';
import { SegmentEnum } from '../usable';

export const ThreadSchema = z.object({
  threadId: z.string(),
  alertOption: z.number(),
  author: ShortProfileSchema,
  condition: z.number(),
  content: z.string(),
  createdTime: z.string(),
  extensions: z.object({
    coHosts: z.array(z.any()).optional(),
    language: SegmentEnum,
    membersCanInvite: z.boolean(),
  }),
  icon: z.string(),
  isPinned: z.boolean(),
  lastReadTime: z.string(),
  latestActivityTime: z.string(),
  membersCount: z.number(),
  membersQuota: z.number(),
  membersSummary: z.array(z.any()),
  membershipStatus: z.number(),
  mentionCount: z.number(),
  modifiedTime: z.string(),
  ndcId: z.number(),
  needHidden: z.boolean(),
  status: z.number(),
  title: z.string(),
  type: z.number(),
  uid: z.string(),
  unreadCount: z.number(),
});

export type Thread = z.infer<typeof ThreadSchema>;
