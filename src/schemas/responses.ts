import z from 'zod';
import { CommunitySchema } from './astranet/community';
import { AccountSchema, ProfileSchema } from './astranet/users';

export const BasicResponseSchema = z.object({
  'api:duration': z.string(),
  'api:message': z.string(),
  'api:statuscode': z.number(),
  'api:timestamp': z.string(),
});

export const LoginResponseSchema = z.object({
  ...BasicResponseSchema.shape,
  auid: z.string(),
  isNewAccount: z.boolean(),
  sid: z.string(),
  account: AccountSchema,
  userProfile: ProfileSchema,
});

export const GetCommunitiesSchema = z.object({
  ...BasicResponseSchema.shape,
  communityList: z.array(CommunitySchema),
});

export type BasicResponse = z.infer<typeof BasicResponseSchema>;
export type GetCommunities = z.infer<typeof GetCommunitiesSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
