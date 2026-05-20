import { z } from 'zod';

export const ThemePackSchema = z.object({
  cover: z.string().optional(),
  themeColor: z.string(),
  themeSideImage: z.string().optional(),
  themeUpperImage: z.string().optional(),
});

export type ThemePack = z.infer<typeof ThemePackSchema>;
