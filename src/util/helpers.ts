export const isStatusCodeSuccess = (statusCode: number): boolean =>
  statusCode == 0;

export const formatMediaList = (
  mediaList: string[],
): [number, string, null][] => mediaList.map((media) => [100, media, null]);
