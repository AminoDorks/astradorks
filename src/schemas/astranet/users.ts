import z from 'zod';

export const AgentSchema = z.object({
  accountMembershipStatus: z.number(),
  aminoId: z.string(),
  followingStatus: z.number(),
  icon: z.string(),
  isAstranet: z.boolean(),
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
  uid: z.number(),
});

export type Agent = z.infer<typeof AgentSchema>;
