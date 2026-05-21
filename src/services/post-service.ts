import { HttpToolKit } from '../core/httptoolkit';
import { Blog, BlogBuilder } from '../schemas';
import { GetBlog, GetBlogSchema } from '../schemas/responses';
import { formatMediaList } from '../util/helpers';

export class PostService {
  private httptoolkit: HttpToolKit;
  private endpoint: string = '/g/s';
  private ndcId?: number;

  constructor(httptoolkit: HttpToolKit, ndcId?: number) {
    this.httptoolkit = httptoolkit;
    this.ndcId = ndcId;
    if (ndcId) this.endpoint = `/x${ndcId}/s`;
  }

  public blog = async (builder: BlogBuilder): Promise<Blog> =>
    (
      await this.httptoolkit.post<GetBlog>(
        {
          path: `${this.endpoint}/blog`,
          body: {
            title: builder.title,
            content: builder.content,
            mediaList: formatMediaList(builder.mediaList ?? []),
            ...(builder.backgroundImage
              ? {
                  extensions: {
                    backgroundMediaList: formatMediaList([
                      builder.backgroundImage,
                    ]), // bad
                    style: {
                      backgroundMediaList: formatMediaList([
                        builder.backgroundImage,
                      ]),
                    },
                  },
                }
              : {}),
          },
        },
        GetBlogSchema,
      )
    ).blog;
}
