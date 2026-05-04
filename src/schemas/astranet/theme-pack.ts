import { z } from 'zod';

export const ThemePackSchema = z.object({
  cover: z.string(),
  themeColor: z.string(),
  themeSideImage: z.string(),
  themeUpperImage: z.string(),
});

export type ThemePack = z.infer<typeof ThemePackSchema>;
