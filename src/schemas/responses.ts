import z from 'zod';
import { CommunitySchema } from './astranet/community';

export const BasicResponseSchema = z.object({
  'api:duration': z.string(),
  'api:message': z.string(),
  'api:statuscode': z.number(),
  'api:timestamp': z.string(),
});

export const GetCommunitiesSchema = z.object({
  ...BasicResponseSchema.shape,
  communityList: z.array(CommunitySchema),
});

export type BasicResponse = z.infer<typeof BasicResponseSchema>;
export type GetCommunities = z.infer<typeof GetCommunitiesSchema>;
