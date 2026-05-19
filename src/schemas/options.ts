import z from 'zod';

import { CredentialsSchema } from './http';
import { HttpToolKit } from '../core/httptoolkit';
import { AccountSchema } from './astranet/users';

export const AstraOptionsSchema = z.object({
  credentials: CredentialsSchema.optional(),
  enableLogging: z.boolean().optional(),
  ndcId: z.number().optional(),

  httptoolkit: z.instanceof(HttpToolKit).optional(),
  account: AccountSchema.optional(),
});

export type AstraOptions = z.infer<typeof AstraOptionsSchema>;
