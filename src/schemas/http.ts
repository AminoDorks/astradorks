import { z } from 'zod';

export const CredentialsSchema = z.object({
  sessionId: z.string(),
  deviceId: z.string(),
  userId: z.string(),
});

export const GETBuilderSchema = z.object({
  path: z.string(),
});

export const POSTBuilderSchema = z.object({
  ...GETBuilderSchema.shape,
  body: z.record(z.string(), z.any()),
});

export const MultipartBuilderSchema = z.object({
  ...GETBuilderSchema.shape,
  body: z.instanceof(Buffer),
});

export const HandleSchema = z.object({
  url: z.string(),
  json: z.unknown(),
});

export const PreparedPartsSchema = z.object({
  headers: z.record(z.string(), z.string()),
  body: z.string(),
});

export type GETBuilder = z.infer<typeof GETBuilderSchema>;
export type POSTBuilder = z.infer<typeof POSTBuilderSchema>;
export type MultipartBuilder = z.infer<typeof MultipartBuilderSchema>;
export type HandleBuilder = z.infer<typeof HandleSchema>;
export type Credentials = z.infer<typeof CredentialsSchema>;
export type PreparedParts = z.infer<typeof PreparedPartsSchema>;
