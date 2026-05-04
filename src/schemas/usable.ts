import z from 'zod';

export const SizingSchema = z.object({
  start: z.number(),
  size: z.number(),
});

export type Sizing = z.infer<typeof SizingSchema>;
