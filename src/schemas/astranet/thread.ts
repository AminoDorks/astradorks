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
});

export type Thread = z.infer<typeof ThreadSchema>;
