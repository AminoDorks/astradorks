import z from 'zod';

export const NoteSchema = z.object({
  content: z.string(),
  createdAt: z.string(),
  mediaType: z.number(),
  noteId: z.string(),
  type: z.number(),
  updatedAt: z.string(),
  mediaValue: z.string().optional(),
  extensions: z
    .object({
      forwardedFrom: z
        .object({
          nickname: z.string().optional(),
          originalChatId: z.string(),
          originalMessageId: z.string(),
          uid: z.string(),
        })
        .optional(),
    })
    .optional(),
});

export type Note = z.infer<typeof NoteSchema>;
