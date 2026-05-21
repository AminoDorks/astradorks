import z from 'zod';

export enum MessageType {
  Text = 0,
  Deleted = 103,
  MemberJoined = 101,
  MemberLeft = 102,
}

export const SizingSchema = z.object({
  start: z.number(),
  size: z.number(),
});

export const EditProfileBuilderSchema = z.object({
  content: z.string().optional(),
  icon: z.string().optional(),
  nickname: z.string().optional(),
  backgroundColor: z.string().optional(),
  backgroundMediaList: z.array(z.string()).optional(),
});

export const SendMessageBuilderSchema = z.object({
  threadId: z.string(),
  content: z.string(),
  type: z.enum(MessageType),
  mediaValue: z.string().optional(),
  replyMessageId: z.string().optional(),
});

export const BlogBuilderSchema = z.object({
  content: z.string(),
  title: z.string(),
  mediaList: z.array(z.string()).optional(),
  backgroundImage: z.string().optional(),
});

export const SegmentEnum = z.enum(['en', 'ru']);
export const SortEnum = z.enum(['newest']);
export const ThreadTypeEnum = z.enum(['public-all']);
export const MembersTypeEnum = z.enum(['leaders', 'curators', 'members']);

export type Sizing = z.infer<typeof SizingSchema>;
export type EditProfileBuilder = z.infer<typeof EditProfileBuilderSchema>;
export type Segment = z.infer<typeof SegmentEnum>;
export type Sort = z.infer<typeof SortEnum>;
export type SendMessageBuilder = z.infer<typeof SendMessageBuilderSchema>;
export type ThreadType = z.infer<typeof ThreadTypeEnum>;
export type MembersType = z.infer<typeof MembersTypeEnum>;
export type BlogBuilder = z.infer<typeof BlogBuilderSchema>;
