import z from 'zod';
import { ActivityMemberSchema } from './users';

export const ActiveCategoryTypeSchema = z.enum([
  'browsing',
  'liveRooms',
  'readingPosts',
  'votingPolls',
  'inChats',
]);

export const ActiveCategorySchema = z.object({
  count: z.number(),
  items: z.array(
    z.object({
      activeCount: z.number(),
      members: z.array(ActivityMemberSchema),
      tab: z.string(),
    }),
  ),
  members: z.array(ActivityMemberSchema),
  type: ActiveCategoryTypeSchema,
});

export type ActiveCategory = z.infer<typeof ActiveCategorySchema>;
