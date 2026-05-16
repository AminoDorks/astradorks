import z from 'zod';
import { AccountSchema } from './astranet/users';
import { DPoPKeysSchema } from './crypto';

export const CachedUnitSchema = z.object({
  account: AccountSchema,
  sid: z.string(),
  deviceId: z.string(),
  DPoPKeys: DPoPKeysSchema,
});

export type CachedUnit = z.infer<typeof CachedUnitSchema>;
