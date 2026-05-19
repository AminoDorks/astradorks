import z from 'zod';
import { CommunitySchema } from './astranet/community';
import { AccountSchema, ProfileSchema } from './astranet/users';

export const BasicResponseSchema = z.object({
  'api:duration': z.string(),
  'api:message': z.string(),
  'api:statuscode': z.number(),
  'api:timestamp': z.string(),
});

export const LoginSchema = z.object({
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

export const MediaUploadSchema = z.object({
  ...BasicResponseSchema.shape,
  mediaValue: z.string(),
});

export const GetUserProfileSchema = z.object({
  ...BasicResponseSchema.shape,
  userProfile: ProfileSchema,
});

export type BasicResponse = z.infer<typeof BasicResponseSchema>;
export type GetCommunities = z.infer<typeof GetCommunitiesSchema>;
export type Login = z.infer<typeof LoginSchema>;
export type MediaUpload = z.infer<typeof MediaUploadSchema>;
export type GetUserProfile = z.infer<typeof GetUserProfileSchema>;
