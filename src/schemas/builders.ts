import { z, ZodType } from 'zod';

export const GETBuilderSchema = z.object({
  path: z.string(),
});

export const POSTBuilderSchema = z.object({
  ...GETBuilderSchema.shape,
  body: z.string(),
});

export const MultipartBuilderSchema = z.object({
  ...GETBuilderSchema.shape,
  body: z.instanceof(Buffer),
});

export const HandleSchema = z.object({
  url: z.string(),
  json: z.unknown(),
});

export type GETBuilder = z.infer<typeof GETBuilderSchema>;
export type POSTBuilder = z.infer<typeof POSTBuilderSchema>;
export type MultipartBuilder = z.infer<typeof MultipartBuilderSchema>;
export type HandleBuilder = z.infer<typeof HandleSchema>;
