import z from 'zod';

export const MediaListSchema = z.tuple([z.number(), z.string(), z.null()]);
