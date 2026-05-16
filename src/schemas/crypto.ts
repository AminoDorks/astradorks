import z from 'zod';

export const DPoPKeysSchema = z.object({
  dpopKeyId: z.string(),
  dpopPublicKey: z.string(),
});

export type DPoPKeys = z.infer<typeof DPoPKeysSchema>;
