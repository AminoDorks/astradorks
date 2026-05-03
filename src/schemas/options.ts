import z from 'zod';

import { CredentialsSchema } from './http';
import { HttpToolKit } from '../core/httptoolkit';

export const AstraOptionsSchema = z.object({
  credentials: CredentialsSchema.optional(),
  enableLogging: z.boolean().optional(),
  ndcId: z.number().optional(),

  httptoolkit: z.instanceof(HttpToolKit).optional(),
});

export type AstraOptions = z.infer<typeof AstraOptionsSchema>;
