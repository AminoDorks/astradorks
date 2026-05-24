import z from 'zod';

export const AgentSchema = z.object({
  accountMembershipStatus: z.number(),
  aminoId: z.string(),
  followingStatus: z.number(),
  icon: z.string(),
  isGlobal: z.boolean(),
  isNicknameVerified: z.boolean(),
  level: z.number(),
  membersCount: z.number(),
  membershipStatus: z.any().nullable(),
  ndcId: z.number(),
  nickname: z.string(),
  reputation: z.number(),
  role: z.number(),
  status: z.number(),
  uid: z.string(),
});

export const AccountSchema = z.object({
  activation: z.number(),
  advancedSettings: z.object({
    analyticsEnabled: z.number(),
  }),
  aminoId: z.string(),
  aminoIdEditable: z.boolean(),
  createdTime: z.string(),
  email: z.string(),
  emailActivation: z.number(),
  icon: z.string(),
  mediaList: z.array(z.any()).nullable(),
  modifiedTime: z.string(),
  nickname: z.string(),
  role: z.number(),
  securityLevel: z.number(),
  status: z.number(),
  uid: z.string(),
});

export const ProfileSchema = z.object({
  accountMembershipStatus: z.number(),
  aminoId: z.string(),
  blogsCount: z.number(),
  commentsCount: z.number(),
  content: z.string().optional(),
  createdTime: z.string(),
  followingStatus: z.number(),
  icon: z.string(),
  id: z.number(),
  isGlobal: z.boolean(),
  isHidden: z.boolean(),
  isNicknameVerified: z.boolean(),
  itemsCount: z.number(),
  joinedCount: z.number(),
  level: z.number(),
  membersCount: z.number(),
  membershipStatus: z.number(),
  modifiedTime: z.string(),
  ndcId: z.number(),
  nickname: z.string(),
  notificationSubscriptionStatus: z.number(),
  onlineStatus: z.number(),
  postsCount: z.number(),
  pushEnabled: z.boolean(),
  reputation: z.number(),
  role: z.number(),
  status: z.number(),
  storiesCount: z.number(),
  uid: z.string(),
});

export const ShortProfileSchema = z.object({
  accountMembershipStatus: z.number(),
  icon: z.string(),
  isNicknameVerified: z.boolean(),
  level: z.number(),
  membershipStatus: z.number().nullable(),
  nickname: z.string(),
  reputation: z.number(),
  role: z.number(),
  status: z.number(),
  uid: z.string(),
});

export const ActivityMemberSchema = z.object({
  icon: z.string(),
  level: z.number(),
  nickname: z.string(),
  onlineStatus: z.number(),
  uid: z.string(),
});

export type Agent = z.infer<typeof AgentSchema>;
export type Account = z.infer<typeof AccountSchema>;
export type Profile = z.infer<typeof ProfileSchema>;
export type ShortProfile = z.infer<typeof ShortProfileSchema>;
export type ActivityMember = z.infer<typeof ActivityMemberSchema>;
