import z from 'zod';
import { CommunitySchema } from './astranet/community';
import { AccountSchema, ProfileSchema } from './astranet/users';
import { CommentSchema } from './astranet/comment';
import { BlogSchema } from './astranet/blog';
import { ThreadSchema } from './astranet/thread';
import { MessageSchema } from './astranet/message';

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

export const GetCommentsSchema = z.object({
  ...BasicResponseSchema.shape,
  commentList: z.array(CommentSchema),
});

export const GetBlogsSchema = z.object({
  ...BasicResponseSchema.shape,
  blogList: z.array(BlogSchema),
});

export const GetCommentSchema = z.object({
  ...BasicResponseSchema.shape,
  comment: CommentSchema,
});

export const GetThreadsSchema = z.object({
  ...BasicResponseSchema.shape,
  threadList: z.array(ThreadSchema),
});

export const GetMessagesSchema = z.object({
  ...BasicResponseSchema.shape,
  messageList: z.array(MessageSchema),
});

export const GetThreadSchema = z.object({
  ...BasicResponseSchema.shape,
  thread: ThreadSchema,
});

export type BasicResponse = z.infer<typeof BasicResponseSchema>;
export type GetCommunities = z.infer<typeof GetCommunitiesSchema>;
export type Login = z.infer<typeof LoginSchema>;
export type MediaUpload = z.infer<typeof MediaUploadSchema>;
export type GetUserProfile = z.infer<typeof GetUserProfileSchema>;
export type GetComments = z.infer<typeof GetCommentsSchema>;
export type GetBlogs = z.infer<typeof GetBlogsSchema>;
export type GetComment = z.infer<typeof GetCommentSchema>;
export type GetThreads = z.infer<typeof GetThreadsSchema>;
export type GetMessages = z.infer<typeof GetMessagesSchema>;
export type GetThread = z.infer<typeof GetThreadSchema>;
