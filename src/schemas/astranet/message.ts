import { z } from 'zod';

import { ShortProfileSchema } from './users';

export const MessageSchema = z.object({
  clientRefId: z.number(),
  content: z.string(),
  createdTime: z.string(),
  includedInSummary: z.boolean(),
  isEdited: z.boolean(),
  isHidden: z.boolean(),
  mediaType: z.number(),
  messageId: z.string(),
  threadId: z.string(),
  type: z.number(),
  uid: z.string(),
  author: ShortProfileSchema,
  mediaValue: z.string().optional(),
  replyMessageId: z.string().optional(),
});

export type Message = z.infer<typeof MessageSchema>;
