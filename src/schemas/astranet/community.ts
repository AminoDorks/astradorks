import z from 'zod';

import { AgentSchema } from './users';
import { ThemePackSchema } from './theme-pack';

export const CommunitySchema = z.object({
  agent: AgentSchema,
  content: z.string().nullable(),
  createdTime: z.string(),
  endpoint: z.string(),
  icon: z.string(),
  joinType: z.number(),
  keywords: z.any().nullable(),
  link: z.string(),
  listedStatus: z.number(),
  mediaList: z.array(z.any()).nullable(),
  membersCount: z.number(),
  membershipStatus: z.number(),
  modifiedTime: z.string(),
  name: z.string(),
  ndcId: z.number(),
  primaryLanguage: z.string(),
  probationStatus: z.number(),
  searchable: z.boolean(),
  status: z.number(),
  tagline: z.string(),
  templateId: z.number(),
  themePack: ThemePackSchema,
  updatedTime: z.string(),
});

export type Community = z.infer<typeof CommunitySchema>;
